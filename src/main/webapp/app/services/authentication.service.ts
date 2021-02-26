import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { MessageService } from '../messages/message.service';
import { SERVER_API_URL } from '@app/app.constants';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';

type JwtToken = {
  id_token: string;
};

@Injectable({ providedIn: "root" })
export class AuthenticationService {
  constructor(private http: HttpClient,
     private messageService: MessageService,
     private $localStorage: LocalStorageService, 
     private $sessionStorage: SessionStorageService
    ) {
  }

  getToken(): string {
    return this.$localStorage.retrieve('authenticationToken') || this.$sessionStorage.retrieve('authenticationToken') || '';
  }

  signUp(email: string, password: string) {
    return this.http.post<any>(SERVER_API_URL + 'api/register', { email, password })
  }

  login(email: string, password: string, rememberMe: boolean) {
    return this.http
      .post<any>(SERVER_API_URL + 'api/authenticate', { email, password })
      .pipe(map(response => this.authenticateSuccess(response, rememberMe)));
  }

  private authenticateSuccess(response: JwtToken, rememberMe: boolean): void {
    const jwt = response.id_token;
    if (rememberMe) {
      this.$localStorage.store('authenticationToken', jwt);
    } else {
      this.$sessionStorage.store('authenticationToken', jwt);
    }
  }

  logout() {
    this.clear();
    this.messageService.add('You have been logged out.');
  }

  unauthorized() {
    this.clear();
    this.messageService.addError('You are unauthorized to view these contents.');
  }

  clear() {
    this.$localStorage.clear('authenticationToken');
    this.$sessionStorage.clear('authenticationToken');
  }
}
