import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '@app/services';
import { SERVER_API_URL } from '@app/app.constants';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if user is logged in and request is to api url
        const authenticationToken = this.authenticationService.getToken();
        const isApiUrl = request.url.startsWith(SERVER_API_URL);
        if (authenticationToken && isApiUrl) {
            request = request.clone({
              setHeaders: {
                  Authorization: `Bearer ${authenticationToken}`
              }
          });
        }
        return next.handle(request);
    }
}
