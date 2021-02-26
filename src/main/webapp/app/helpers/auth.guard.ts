import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthenticationService, UserService } from "@app/services";
import { User } from "@app/models/user.model";

import { createElementCssSelector } from "@angular/compiler";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  private user: User

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
   // console.log(this.userService.identity())
    this.userService.identity().subscribe(user => this.user = user);
    if (this.user) {
      // check if route is restricted by role
      if (!route.data.roles) {
        return true;
      } else if (route.data.roles && !this.user.authorities) {
        // role not authorised so redirect to home page
        this.router.navigate(["/"]);
        return false;
      } else if (route.data.roles && this.user.authorities) {
        for (const element of route.data.roles) {
          if (this.user.authorities.indexOf(element) > -1) {
            return true;
          }
        }
      } else {
        this.router.navigate(["/"]);
        return false;
      }
    }
    // not logged in so redirect to login page with the return url
    this.router.navigate(["/register-login"], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }
}
