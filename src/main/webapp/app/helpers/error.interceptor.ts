import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService, UserService } from '@app/services';
import { first } from 'rxjs/operators';
import { MessageService } from '../messages/message.service';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authService: AuthenticationService, private userService: UserService, private messageService: MessageService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if ([401, 403].indexOf(err.status) !== -1 && err.error.path !== "/api/authenticate" && err.error.path !== "/api/account") {
                this.authService.unauthorized().subscribe(null, null, () => this.userService.authenticate(null));
                //location.reload(true);
            }
            else if ([400].indexOf(err.status) !== -1) {
                const data = err.error.errors[0]
                return throwError(data.field + " " + data.defaultMessage);
            }
            const error = err.error.message || err.statusText;
            return throwError(error);
        }))
    }
}
