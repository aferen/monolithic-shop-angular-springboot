import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { AuthenticationService, UserService } from '@app/services';
import { OffcanvasService } from '../shared/offcanvas.service';

import { User } from '../../models/user.model';

@Component({
  selector: 'app-navigation-off-canvas',
  templateUrl: './navigation-off-canvas.component.html',
  styleUrls: ['./navigation-off-canvas.component.scss']
})
export class NavigationOffCanvasComponent implements OnInit, OnDestroy {
  private authSubscription: Subscription;
  public user: User;

  constructor(
    public offcanvasService: OffcanvasService,
    public authService: AuthenticationService,
    public userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authSubscription = this.userService.getAuthenticationState().subscribe((user) => {
      this.user = user;
    });
  }

  public onLogout(e: Event) {
    this.offcanvasService.closeOffcanvasNavigation();
    this.authService.logout().subscribe(null, null, () => this.userService.authenticate(null));
    this.router.navigate(['/register-login']);
    e.preventDefault();
  }

  public onNavigationClick() {
    this.offcanvasService.closeOffcanvasNavigation();
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
