import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { MessageService } from '../messages/message.service';
import { User, Token } from "@app/models";
import { SERVER_API_URL } from '@app/app.constants';

@Injectable({ providedIn: "root" })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  private currentTokenSubject: BehaviorSubject<Token>;
  public currentToken: Observable<Token>;

  constructor(private http: HttpClient,
     private messageService: MessageService
     ) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem("currentUser"))
    );
    this.currentUser = this.currentUserSubject.asObservable();

    this.currentTokenSubject = new BehaviorSubject<Token>(
      JSON.parse(localStorage.getItem("currentToken"))
    );
    this.currentToken = this.currentTokenSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public get currentTokenValue(): Token {
    return this.currentTokenSubject.value;
  }

  login(email: string, password: string) {
    return this.http
      .post<any>(SERVER_API_URL + 'api/authenticate', { email, password })
      .pipe(
        map((data) => {
          if (data.id_token) {
            localStorage.setItem("currentToken", JSON.stringify(data.id_token));
            this.currentTokenSubject.next(data.id_token);
          }
          return data;
        })
      );
  }


  signUp(email: string, password: string) {
    return this.http.post<any>(SERVER_API_URL + 'api/register', { email, password })
  }

  getAccount() {
    return this.http
      .get<any>(SERVER_API_URL + 'api/account', {
        headers: {
          Authorization: "Bearer " + this.currentTokenSubject.value,
        },
      })
      .pipe(
        map(
          (user) => {
            if (user) {
              localStorage.setItem("currentUser", JSON.stringify(user));
              this.currentUserSubject.next(user);
            }
            return user;
          },
          (error) => {
            console.log(error);
            // this.error = error;
            //this.loading = false;
          }
        )
      );
  }

  updateProfile(account: Account) {
    return this.http.post(SERVER_API_URL + 'api/account', account)
    .toPromise()
    .then(() => this.messageService.add('Profile has been updated!'))
    .catch((error) => {
      this.messageService.addError('Profile has not been updated!');
    });
  }

  updatePassword(newPassword: string, currentPassword: string) {
    return this.http.post(SERVER_API_URL + 'api/account/change-password', { currentPassword, newPassword })
    .toPromise()
      .then(() => this.messageService.add('Password has been updated!'))
      .catch((error) => {
        this.messageService.addError('Password has not been updated!');
      });
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem("currentUser");
    localStorage.removeItem("currentToken");
    this.currentUserSubject.next(null);
    this.currentTokenSubject.next(null);
    this.messageService.add('You have been logged out.');
  }
}
