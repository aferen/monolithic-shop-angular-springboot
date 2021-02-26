import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { UserService } from '@app/services';

import { User } from '../../../models/user.model';

@Component({
  selector: 'app-navigation-main',
  templateUrl: './navigation-main.component.html',
  styleUrls: ['./navigation-main.component.scss']
})
export class NavigationMainComponent implements OnInit, OnDestroy {
  public user: User;
  private authSubscription: Subscription;

  constructor(public userService: UserService) {}

  ngOnInit() {
    this.userService.identity().subscribe((user) => {
      this.user = user;
    });
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
