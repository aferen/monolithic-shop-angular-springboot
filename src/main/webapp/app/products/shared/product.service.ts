import {
  combineLatest as observableCombineLatest,
  Observable,
  from as fromPromise,
  of,
  pipe,
} from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, tap, switchMap, map } from "rxjs/operators";
import { AuthenticationService } from "@app/_services";
import { FileUploadService } from "./file-upload.service";
import { MessageService } from "../../messages/message.service";
import { ProductRatingService } from "./product-rating.service";
import { Product } from "../../models/product.model";
import { ProductsUrl } from "./productsUrl";
import { SERVER_API_URL } from "@app/app.constants";

@Injectable()
export class ProductService {
  private productsUrl = ProductsUrl.productsUrl;
  private productImagesUrl = ProductsUrl.productImagesUrl;
  private featuredUrl = ProductsUrl.featuredUrl;
  private featuredImagesUrl = ProductsUrl.featuredImagesUrl;
  private productsQueryUrl = ProductsUrl.productsQueryUrl;
  private productsDateUrl = ProductsUrl.productsDateUrl;
  private productsRatingUrl = ProductsUrl.productsRatingUrl;
  private productsFindUrl = ProductsUrl.productsFindUrl;

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    public authService: AuthenticationService,
    private uploadService: FileUploadService,
    private productRatingService: ProductRatingService
  ) {}

  /** Log a ProductService message with the MessageService */
  private logError(message: string) {
    this.messageService.addError("ProductService: " + message);
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
  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      this.logError(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  public getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(SERVER_API_URL + this.productsUrl).pipe(
      map((products) => {
        return this.setImagesUrl(products);
      }),
      catchError(this.handleError<Product[]>("getProducts", []))
    );
  }

  public getProduct(id: any): Observable<Product | null> {
    const url = `${this.productsUrl}/${id}`;
    return this.http.get<Product>(SERVER_API_URL + url).pipe(
      tap((product) => {
        if (product) {
          if(product.imageNames) {
            product.imageURLs = []
            product.imageNames.forEach((imageName) => {
              product.imageURLs.push(
                SERVER_API_URL + this.productImagesUrl + imageName
              );
            });
          }
       
          return of(product);
        } else {
          this.messageService.addError(`Found no Product with id=${id}`);
          return of(null);
        }
      }),
      catchError(this.handleError<Product>(`getProduct id=${id}`))
    );
  }

  public getProductsQuery(
    byChild: string,
    equalTo: string | boolean,
    limitToFirst: number
  ): Observable<Product[]> {
    const url = `${this.productsQueryUrl}/${byChild}/${equalTo}/${limitToFirst}`;
    return this.http.get<Product[]>(SERVER_API_URL + url).pipe(
      map((products) => {
        return this.setImagesUrl(products);
      }),
      catchError(this.handleError<Product[]>(`getProductsQuery`))
    );
  }

  public findProducts(term): Observable<any> {
    const url = `${this.productsFindUrl}/${term}`;
    return this.http.get<Product[]>(SERVER_API_URL + url).pipe(
      map((products) => {
        return this.setImagesUrl(products);
      }),
      catchError(this.handleError<Product[]>(`findProducts`))
    );
  }

  public getProductsByDate(limitToLast: number): Observable<Product[]> {
    const url = `${this.productsDateUrl}/${limitToLast}`;
    return this.http.get<Product[]>(SERVER_API_URL + url).pipe(
      map((products) => {
        return this.setImagesUrl(products);
      }),
      catchError(this.handleError<Product[]>(`getProductsByDate`))
    );
  }

  public getProductsByRating(limitToLast: number): Observable<Product[]> {
    const url = `${this.productsRatingUrl}/${limitToLast}`;
    return this.http.get<Product[]>(SERVER_API_URL + url).pipe(
      map((products) => {
        return this.setImagesUrl(products);
      }),
      catchError(this.handleError<Product[]>(`getProductsByRating`))
    );
  }

  public getFeaturedProducts(): Observable<any[]> {
    return this.http.get<any[]>(SERVER_API_URL + this.featuredUrl).pipe(
      switchMap(
        (actions) => {
          return observableCombineLatest(
            actions.map((action) => this.getProduct(action.productId))
          );
        },
        (actionsFromSource, resolvedProducts) => {
          resolvedProducts.map((product, i) => {
            product["imageFeaturedUrl"] =
              SERVER_API_URL +
              this.featuredImagesUrl +
              actionsFromSource[i].imageName;
            return product;
          });
          return resolvedProducts;
        }
      ),
      catchError(this.handleError<Product[]>(`getFeaturedProducts`))
    );
  }

  public addProduct(data: { product: Product; files: FileList }) {
    const dbOperation = this.uploadService
      .startUpload(data.files, "api/images/product")
      .toPromise()
      .then((list) => {
        var resultArray = Object.keys(list).map(function (index) {
          let item = list[index];
          return item;
        });
        data.product.imageNames = resultArray;
        return data;
      })
      .then((dataWithImagePath) => {
        return this.http
          .post<Product>(SERVER_API_URL + this.productsUrl, data.product)
          .toPromise()
          .then(
            (response) => {
              // Success
              this.logSuccess(`Added Product ${data.product.name}`);
              return response;
            },
            (error) => {
              // Error
              this.messageService.addError(
                `Add Failed, Product ${data.product.name}`
              );
              this.handleError(error);
              return error;
            }
          );
      });
    return fromPromise(dbOperation);
  }

  public updateProduct(data: { product: Product; files: FileList }) {
    if (!data.files.length) {
      return this.updateProductWithoutNewImage(data.product, this.productsUrl);
    }

    const dbOperation = this.uploadService
      .startUpload(data.files, "api/images/product")
      .toPromise()
      .then((list) => {
        var resultArray = Object.keys(list).map(function (index) {
          let item = list[index];
          return item;
        });

        data.product.imageNames = resultArray;
        return data;
      })
      .then((dataWithImagePath) => {
        return this.http
          .put<Product>(SERVER_API_URL + this.productsUrl, data.product)
          .toPromise()
          .then(
            (response) => {
              // Success
              this.logSuccess(`Updated Product ${data.product.name}`);
              return response;
            },
            (error) => {
              // Error
              this.handleError(error);
              return error;
            }
          );
      });
    return fromPromise(dbOperation);
  }

  private updateProductWithoutNewImage(product: Product, url: string) {
    const dbOperation = this.http
      .put<Product>(SERVER_API_URL + url, product)
      .toPromise()
      .then(
        (response) => {
          // Success
          this.logSuccess(`Updated Product ${product.name}`);
          return response;
        },
        (error) => {
          // Error
          this.handleError(error);
          return error;
        }
      );
    return fromPromise(dbOperation);
  }

  public deleteProduct(product: Product) {
    const url = `${this.productsUrl}/${product.id}`;

    this.uploadService.deleteFile(product.imageNames, "api/images/product");

    return this.http
      .delete<Product>(SERVER_API_URL + url)
      .toPromise()
      .then(() => this.logSuccess("Successfully Deleted " + product.name))
      .catch((error) => {
        this.messageService.addError("Delete failed " + product.name);
        this.handleError("delete product");
      });
  }

  private setImagesUrl(products: Product[]): Product[] {
    products.forEach((product) => {
      product.imageURLs = [];
      product.imageNames.forEach((imageName) => {
        product.imageURLs.push(
          SERVER_API_URL + this.productImagesUrl + imageName
        );
      });
    });
    return products;
  }
}
