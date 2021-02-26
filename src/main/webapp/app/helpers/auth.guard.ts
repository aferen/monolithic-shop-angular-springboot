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
import { map } from "rxjs/operators";
import { createElementCssSelector } from "@angular/compiler";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  private user: User

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService
  ) {}


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const authorities = route.data['authorities'];
    console.log(route)
    return this.userService.identity().pipe(
      map(user => {
        if (user) {
          if (!authorities || authorities.length === 0) {
            return true;
          }
          const hasAnyAuthority = this.userService.hasAnyAuthority(authorities);
          if (hasAnyAuthority) {
            return true;
          }
          
          this.router.navigate(['/']);
          return false;
        }

        this.router.navigate(["/register-login"], {
          queryParams: { returnUrl: state.url },
        });
        return false;
      })
    );  
  }
}
