import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpUserEvent,
} from "@angular/common/http";
import { BehaviorSubject, Observable, of, ReplaySubject } from "rxjs";
import { shareReplay, map, catchError, tap, flatMap } from "rxjs/operators";
import { MessageService } from "../messages/message.service";
import { User } from "@app/models";
import { SERVER_API_URL } from "@app/app.constants";
import { AuthenticationService } from '@app/services/authentication.service';

@Injectable({ providedIn: "root" })
export class UserService {
  private user$?: Observable<User | null>;
  private userIdentity: User | null = null;
  private authenticationState = new ReplaySubject<User | null>(1);


  constructor(private messageService: MessageService,
    private authService: AuthenticationService,
    private http: HttpClient) { }

  identity(force?: boolean): Observable<User | null> {
    if(this.authService.getToken()) {
      if (!this.user$ || force || !this.isAuthenticated()) {
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
    this.authenticationState.next(this.userIdentity);
  }

  getAuthenticationState(): Observable<User | null> {
    return this.authenticationState.asObservable();
  }
  
  isAuthenticated(): boolean {
    return this.userIdentity !== null;
  }
  

  hasAnyAuthority(authorities: string[] | string): boolean {
    if (!this.userIdentity || !this.userIdentity.authorities) {
      return false;
    }
    if (!Array.isArray(authorities)) {
      authorities = [authorities];
    }
    return this.userIdentity.authorities.some((authority: string) => authorities.includes(authority));
  }

  updateProfile(user: User) {
    return this.http.post(SERVER_API_URL + "api/account", user)
  }

  updatePassword(newPassword: string, currentPassword: string) {
    return this.http
      .post(SERVER_API_URL + "api/account/change-password", {
        currentPassword,
        newPassword,
      })
  }
}
