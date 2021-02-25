import { Injectable, OnInit } from '@angular/core';
import { Observable ,  of ,  from as fromPromise } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SERVER_API_URL } from "@app/app.constants";
import { Order } from '../../../models/order.model';
import { User } from '../../../models/user.model';
import { HttpClient } from "@angular/common/http";

import { MessageService } from '../../../messages/message.service';
import { AuthenticationService } from '@app/_services';

@Injectable()
export class OrderService {
  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private authService: AuthenticationService,
  ) {}

  public getOrders() {
    return this.authService.currentUser
      .pipe(
        switchMap((user:User) => {
          if (user) 
          {
            const userOrdersUrl = `api/orders/${user.id}`;
            return this.http.get<Order[]>(SERVER_API_URL + userOrdersUrl)
          } else {
            return of(null);
          }
        })
      );
  }

  public addUserOrder(order: Order, total: number, userId: string) {
    order.userId = userId;
    const orderWithMetaData = {
      ...order,
      ...this.constructOrderMetaData(order),
      total
    };
    const userOrdersUrl = `api/orders/${userId}`;
    const result = this.http.post<Order[]>(SERVER_API_URL + userOrdersUrl, orderWithMetaData)
    // this.store
    //   .list(`users/${user}/orders`)
    //   .push(orderWithMetaData)
    //   .then((response) => response, (error) => error);

    return fromPromise(result);
  }

  // public addAnonymousOrder(order: Order, total: number) {
  //   const orderWithMetaData = {
  //     ...order,
  //     ...this.constructOrderMetaData(order),
  //     total
  //   };

  //   const databaseOperation = this.store
  //     .list('orders')
  //     .push(orderWithMetaData)
  //     .then((response) => response, (error) => error);

  //   return fromPromise(databaseOperation);
  // }

  private constructOrderMetaData(order: Order) {
    return {
      number: (Math.random() * 10000000000).toString().split('.')[0],
      date: new Date().toString(),
      status: 'In Progress'
    };
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.messageService.addError(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
