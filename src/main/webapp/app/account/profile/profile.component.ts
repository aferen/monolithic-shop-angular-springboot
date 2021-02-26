import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { flatMap } from 'rxjs/operators';
import { AuthenticationService } from '@app/services';
import { UserService } from '@app/services';
import { User } from '../../models/user.model';
import { Subscription } from 'rxjs';
import { MessageService } from "../../messages/message.service";

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

  constructor(private authService: AuthenticationService,
    private userService: UserService,
    private messageService: MessageService
    ) { }

  ngOnInit() {
    this.initFormGroup();
    this.authSubscription = this.userService.getAuthenticationState().subscribe(
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
      this.userService.updateProfile(this.formProfile.value)
      .pipe(flatMap(() => this.userService.identity(true)))
      .subscribe(
        () => {
          this.messageService.add("Profile has been updated!")
        },
        (error) => {
          this.messageService.addError("Profile has not been updated!");
        }
      );
    }

    if(this.formProfile.value.newPassword !== this.formProfile.value.confirmPassword){
      this.profileErrors = "New Password is not equal Confirm Password"
    }
    else if (this.formProfile.value.oldPassword && this.formProfile.value.newPassword && this.formProfile.value.confirmPassword
      && (this.formProfile.value.newPassword === this.formProfile.value.confirmPassword)) {
        this.userService.updatePassword(this.formProfile.value.newPassword,this.formProfile.value.oldPassword)
        .pipe(flatMap(() => this.userService.identity(true)))
        .subscribe(
          () => {
            this.messageService.add("Password has been updated!")
          },
          (error) => {
            this.messageService.addError("Password has not been updated!");
          }
       );
      }
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
