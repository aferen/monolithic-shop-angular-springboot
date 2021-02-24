
import {combineLatest as observableCombineLatest,  Observable ,  from as fromPromise ,  of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError ,  tap, switchMap, map } from 'rxjs/operators';
import { AuthenticationService } from '@app/_services';
import { FileUploadService } from './file-upload.service';
import { MessageService } from '../../messages/message.service';
import { ProductRatingService } from './product-rating.service';

import { Product } from '../../models/product.model';
import { ProductsUrl } from './productsUrl';
import { HelperService } from '../../shared/helper.service';


@Injectable()
export class ProductService {
  private productsUrl = ProductsUrl.productsUrl;
  private featuredUrl = ProductsUrl.featuredUrl;
  private productsQueryUrl = ProductsUrl.productsQueryUrl;
  private productsDateUrl = ProductsUrl.productsDateUrl;
  private productsRatingUrl = ProductsUrl.productsRatingUrl;
  private productsFindUrl = ProductsUrl.productsFindUrl;

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    public authService: AuthenticationService,
    private uploadService: FileUploadService,
    private productRatingService: ProductRatingService,
    private helperService : HelperService
  ) {}

  /** Log a ProductService message with the MessageService */
  private logError(message: string) {
    this.messageService.addError('ProductService: ' + message);
  }


  private logSuccess(message: string) {
    this.messageService.add(message);
  }


  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      this.logError(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  public getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.helperService.getUrl(this.productsUrl)).pipe(
      catchError(this.handleError<Product[]>('getProducts', []))
    );
  }

  public getProductsQuery(
    byChild: string,
    equalTo: string | boolean,
    limitToFirst: number
  ): Observable<Product[]> {
     const url = `${this.productsQueryUrl}/${byChild}/${equalTo}/${limitToFirst}`;
     return this.http.get<Product[]>(this.helperService.getUrl(url))
     .pipe(catchError(this.handleError<Product[]>(`getProductsQuery`)));
  }

  public findProducts(term): Observable<any> {
     const url = `${this.productsFindUrl}/${term}`;
     return this.http.get<Product[]>(this.helperService.getUrl(url))
    .pipe(catchError(this.handleError<Product[]>(`findProducts`)));
  }

  public getProductsByDate(limitToLast: number): Observable<Product[]> {
    const url = `${this.productsDateUrl}/${limitToLast}`;
     return this.http.get<Product[]>(this.helperService.getUrl(url))
     .pipe(
      map((arr) => arr.reverse()),
      catchError(this.handleError<Product[]>(`getProductsByDate`))
    );
  }

  public getProductsByRating(limitToLast: number): Observable<Product[]> {
    const url = `${this.productsRatingUrl}/${limitToLast}`;
    return this.http.get<Product[]>(this.helperService.getUrl(url))
    .pipe(map((arr) => arr.reverse()), catchError(this.handleError<Product[]>(`getProductsByRating`)));
  }

  public getFeaturedProducts(): Observable<any[]> {
     return this.http.get<any[]>(this.helperService.getUrl(this.featuredUrl))
     .pipe(
      switchMap(
        (actions) => {
          return observableCombineLatest(
            actions.map((action) => this.getProduct(action.productId))
          );
        },
        (actionsFromSource, resolvedProducts) => {
          resolvedProducts.map((product, i) => {
            product['imageFeaturedUrl'] = actionsFromSource[
              i
            ].imageFeaturedUrl;
            return product;
          });
          return resolvedProducts;
        }
      ),
      catchError(this.handleError<Product[]>(`getFeaturedProducts`)));
  }

  public getProduct(id: any): Observable<Product | null> {
    const url = `${this.productsUrl}/${id}`;
    return this.http.get<Product>(this.helperService.getUrl(url)).pipe(
      tap((result) => {
        if (result) {
          return of(result);
        } else {
          this.messageService.addError(`Found no Product with id=${id}`);
          return of(null);
        }
      }),
      catchError(this.handleError<Product>(`getProduct id=${id}`))
    );
  }

  public addProduct(data: { product: Product; files: FileList }) {
    const dbOperation = this.uploadService
      .startUpload(data.files,"images/product").toPromise()
      .then((list) => {
        var resultArray = Object.keys(list).map(function(index){
          let item = list[index];
          return item;
      });
        data.product.imageNames = resultArray;
        return data;
      })
      .then((dataWithImagePath) => {
        return this.http.post<Product>(this.helperService.getUrl(this.productsUrl), data.product)
        .toPromise()
        .then(
          response => { // Success
            this.logSuccess(`Added Product ${data.product.name}`);
            return response;
          },
          error => { // Error
            this.messageService.addError(
              `Add Failed, Product ${data.product.name}`
            );
            this.handleError(error);
            return error;
          }
       );
      })
    return fromPromise(dbOperation);

  }

  public updateProduct(data: { product: Product; files: FileList }) {
    if (!data.files.length) {
      return this.updateProductWithoutNewImage(data.product, this.productsUrl);
    }

    const dbOperation = this.uploadService
      .startUpload(data.files,"images/product").toPromise()
      .then((list) => {
        var resultArray = Object.keys(list).map(function(index){
          let item = list[index];
          // do something with person
          return item;
        });
       
        data.product.imageNames = resultArray;
        return data;
      })
      .then((dataWithImagePath) => {
        return this.http.put<Product>(this.helperService.getUrl(this.productsUrl), data.product)
        .toPromise()
        .then(
          response => { // Success
            this.logSuccess(`Updated Product ${data.product.name}`);
            return response;
          },
          error => { // Error
            this.handleError(error);
            return error;
          }
       );
      })
    return fromPromise(dbOperation);
  }

  private updateProductWithoutNewImage(product: Product, url: string) {
    const dbOperation = this.http.put<Product>(this.helperService.getUrl(url), product)
    .toPromise()
    .then(
      response => { // Success
        this.logSuccess(`Updated Product ${product.name}`);
        return response;
      },
      error => { // Error
        this.handleError(error);
        return error;
      }
    );
   return fromPromise(dbOperation);
  }

  public deleteProduct(product: Product) {
    const url = `${this.productsUrl}/${product.id}`;

    this.uploadService.deleteFile(product.imageNames,"images/product");

    return this.http.delete<Product>(this.helperService.getUrl(url))
      .toPromise()
      .then(() => this.logSuccess('Successfully Deleted ' + product.name))
      .catch((error) => {
        this.messageService.addError('Delete failed ' + product.name);
        this.handleError('delete product');
      });
  }
}
