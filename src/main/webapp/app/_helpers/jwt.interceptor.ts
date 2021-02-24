import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '@app/_services';
import { SERVER_API_URL } from '@app/app.constants';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if user is logged in and request is to api url
        const currentUser = this.authenticationService.currentUserValue;
        const currentToken = this.authenticationService.currentTokenValue;
        const isLoggedIn = currentUser && currentToken;
        const isApiUrl = request.url.startsWith(SERVER_API_URL);
        if (isLoggedIn && isApiUrl) {
          if (request.url !== SERVER_API_URL + 'api/token') {
            request = request.clone({
              setHeaders: {
                  Authorization: `Bearer ${currentToken}`
              }
          });
          }
        }
        return next.handle(request);
    }
}
