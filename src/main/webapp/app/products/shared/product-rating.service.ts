import { Injectable } from '@angular/core';
import { Observable ,  from as fromPromise ,  of } from 'rxjs';
import { UserService } from '@app/services';
import { MessageService } from '../../messages/message.service';
import { FileUploadService } from './file-upload.service';
import { HttpClient } from "@angular/common/http";
import { SERVER_API_URL } from "@app/app.constants";
import { ProductsUrl } from './productsUrl';
import { Product } from '../../models/product.model';
import { User } from '../../models/user.model';

@Injectable()
export class ProductRatingService {
  private productsUrl = ProductsUrl.productsUrl;
  private user: User;

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    public userService: UserService
  ) {
    this.userService.identity().subscribe(user => this.user = user);
  }

  /** Log a ProductService message with the MessageService */
  private log(message: string) {
    this.messageService.add('ProductService: ' + message);
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
      this.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  public rateProduct(product: Product, rating: number) {
    const updates = this.constructRating(product, rating);
    product.currentRating = this.calculateOverallRating(product,rating);
    return fromPromise(
        this.http
        .put<Product>(SERVER_API_URL + this.productsUrl, product)
        .toPromise()
        .then(() => this.log(`Rated Product ${product.name} width: ${rating}`))
        .catch((error) => {
          this.handleError<any>(error);
        })
    );
  }
// pure helper functions start here
  private constructRating(product: Product, rating: number) {
    // construct container for update content
    const updates = {};

    // Add user rating to local version of ratings
    if (product.ratings) {
      product.ratings[this.user.id] = rating;
    } else {
      product['ratings'] = [];
      product['ratings'][this.user.id] = rating;
    }

    // Add user rating
    updates['/ratings/' + this.user.id + '/'] = rating;

    // calculate current overall rating
    updates['/currentRating/'] = this.calculateOverallRating(product, rating);
    return updates;
  }

  private calculateOverallRating(product: Product, rating: number): number {
    // Calculate and add new overall rating
    const currentRating =
      <number>Object.values(product.ratings).reduce(
        (a: number, b: number) => a + b,
        0
      ) / Object.values(product.ratings).length;

    return currentRating;
  }
}
