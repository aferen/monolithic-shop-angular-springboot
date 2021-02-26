import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { AuthenticationService,UserService } from '@app/services';
import { OffcanvasService } from '../shared/offcanvas.service';

import { User } from '../../models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authSubscription: Subscription;
  public user: User;
  public showSearch;

  constructor(
    private userService: UserService,
    private authService: AuthenticationService,
    private router: Router,
    private offcanvasService: OffcanvasService
  ) {}

  ngOnInit() {
    this.authSubscription = this.userService.identity().subscribe((user) => {
      this.user = user;
    });
  }

  public onLogOut(e: Event) {
    this.authService.logout();
    this.router.navigate(['/register-login']);
    e.preventDefault();
  }

  public onMenuToggle(e: Event) {
    this.offcanvasService.openOffcanvasNavigation();
    e.preventDefault();
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
