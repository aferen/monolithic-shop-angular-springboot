import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '@app/_services';

import { take ,  map ,  tap } from 'rxjs/operators';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthenticationService, private router: Router) {}

  public canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // return this.authService.currentUser.pipe(
    //   take(1),
    //   map((user) => (user && user.authorities.indexOf(Role.admin) ? true : false)),
    //   tap((authorized) => {
    //     if (!authorized) {
    //       this.router.navigate(['/register-login']);
    //     }
    //   })
    // );
    return true;
  }
}
