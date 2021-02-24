import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';

import { AuthenticationService } from '@app/_services';

import { User } from '../../models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  private authSubscription: Subscription;
  public formProfile: FormGroup;
  public profileErrors: string;
  private user: User;

  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
    this.initFormGroup();
    this.authSubscription = this.authService.currentUser.subscribe(
      user => {
        if (user) {
          this.formProfile.patchValue({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
          });
          this.user = user;
        }
      }
    );
  }

  private initFormGroup() {
    this.formProfile = new FormGroup({
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.email),
      newPassword: new FormControl(null),
      oldPassword: new FormControl(null),
      confirmPassword: new FormControl(null),
    });
  }

  public onSubmit() {
    if (this.user.email !== this.formProfile.value.email || this.user.firstName !== this.formProfile.value.firstName || this.user.lastName !== this.formProfile.value.lastName) {
      this.authService.updateProfile(this.formProfile.value)
    }

    if(this.formProfile.value.newPassword !== this.formProfile.value.confirmPassword){
      this.profileErrors = "New Password is not equal Confirm Password"
    }
    else if (this.formProfile.value.oldPassword && this.formProfile.value.newPassword && this.formProfile.value.confirmPassword
      && (this.formProfile.value.newPassword === this.formProfile.value.confirmPassword)) {
        this.authService.updatePassword(this.formProfile.value.newPassword,this.formProfile.value.oldPassword)
    }
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
