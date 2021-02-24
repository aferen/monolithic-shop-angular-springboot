import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '@app/_services';
import { createElementCssSelector } from '@angular/compiler';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      const currentUser = this.authenticationService.currentUserValue;
        if (currentUser) {
          // check if route is restricted by role
         if(!route.data.roles) {
          return true;
         }
         else if (route.data.roles && !currentUser.authorities) {
              // role not authorised so redirect to home page
              this.router.navigate(['/']);
              return false;
          }
          else if (route.data.roles && currentUser.authorities) {
            for (const element of route.data.roles) {
              if(currentUser.authorities.indexOf(element) > -1) {
                return true;
              }
            }
          }
          else {
            this.router.navigate(['/']);
            return false;
          }
        }
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/register-login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}

