import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HelperService } from '../shared/helper.service';
import { environment } from '@environments/environment';
import { AuthenticationService } from '@app/_services';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService, private helperService : HelperService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if user is logged in and request is to api url
        const currentUser = this.authenticationService.currentUserValue;
        const currentToken = this.authenticationService.currentTokenValue;
        const isLoggedIn = currentUser && currentToken;
        const isApiUrl = request.url.startsWith(environment.app.apiBaseUrl);
        if (isLoggedIn && isApiUrl) {
          if (request.url !== this.helperService.getUrl("token")) {
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
