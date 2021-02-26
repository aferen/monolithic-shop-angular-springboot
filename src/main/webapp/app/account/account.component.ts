import { Component } from '@angular/core';

import { AuthenticationService } from '@app/services';
import { Router } from '@angular/router';
import { OrderService } from './orders/shared/order.service';

import { User } from '../models/user.model';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {
  public user: User;

  constructor(
    private authService: AuthenticationService,
    public router: Router,
    public orderService: OrderService
  ) {}
}
