import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpUserEvent,
} from "@angular/common/http";
import { BehaviorSubject, Observable, of } from "rxjs";
import { shareReplay, map, catchError, tap } from "rxjs/operators";
import { MessageService } from "../messages/message.service";
import { User } from "@app/models";
import { SERVER_API_URL } from "@app/app.constants";
import { AuthenticationService } from '@app/services/authentication.service';

@Injectable({ providedIn: "root" })
export class UserService {
  private user$?: Observable<User | null>;
  private userIdentity: User | null = null;

  constructor(private messageService: MessageService,
    private authService: AuthenticationService,
    private http: HttpClient) {}

  identity(): Observable<User | null> {
    if(this.authService.getToken()) {
      if (!this.user$ || !this.isAuthenticated()) {
        this.user$ = this.fetch().pipe(
          catchError(() => {
            return of(null);
          }),
          tap((user: User | null) => {
            this.authenticate(user);
          }),
          shareReplay()
        );
      }
      return this.user$;
    } else {
      this.userIdentity = null;
      return of(this.userIdentity);
    }
  }

  private fetch(): Observable<User> {
    return this.http.get<User>(SERVER_API_URL + 'api/account');
  }

  authenticate(identity: User | null): void {
    this.userIdentity = identity;
    // this.authenticationState.next(this.userIdentity);
  }
  
  isAuthenticated(): boolean {
    return this.userIdentity !== null;
  }
  
  updateProfile(user: User) {
    return this.http
      .post(SERVER_API_URL + "api/account", user)
      .toPromise()
      .then(() => this.messageService.add("Profile has been updated!"))
      .catch((error) => {
        this.messageService.addError("Profile has not been updated!");
      });
  }

  updatePassword(newPassword: string, currentPassword: string) {
    return this.http
      .post(SERVER_API_URL + "api/account/change-password", {
        currentPassword,
        newPassword,
      })
      .toPromise()
      .then(() => this.messageService.add("Password has been updated!"))
      .catch((error) => {
        this.messageService.addError("Password has not been updated!");
      });
  }
}
