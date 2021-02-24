import { Component, OnInit, ViewChild, OnChanges } from "@angular/core";
import {
  FormGroup,
  ReactiveFormsModule,
  FormControl,
  Validators,
} from "@angular/forms";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { MessageService } from "../../messages/message.service";
import { AuthenticationService } from "@app/_services";
import { first } from "rxjs/operators";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-register-login",
  templateUrl: "./register-login.component.html",
  styleUrls: ["./register-login.component.scss"],
})
export class RegisterLoginComponent implements OnInit {
  public loginForm: FormGroup;
  public registerForm: FormGroup;
  public registerErrors: string;
  submitted = false;
  returnUrl: string;
  error = "";
  loading = false;

  constructor(
    //private authenticationService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private authenticationService: AuthenticationService
  ) {
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(["/"]);
    }
  }

  ngOnInit() {
    this.initLoginForm();
    this.initRegisterForm();

    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
  }

  private initLoginForm() {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required),
    });
  }

  private initRegisterForm() {
    this.registerForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required),
      confirmPassword: new FormControl(null, Validators.required),
    });
  }

  public onRegister() {
    if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
      this.registerErrors = 'Passwords don\'t match!';
      this.registerForm.controls.password.setErrors({ password: true });
      this.registerForm.controls.confirmPassword.setErrors({ confirmPassword: true });
    } else {
      this.authenticationService.signUp(this.registerForm.value.email, this.registerForm.value.password)
      .subscribe(
        () => {
          this.messageService.add('Account created successfully. Please login with your new credentials!');
          this.loginForm.setValue({ email: this.registerForm.value.email, password: ''});
          this.initRegisterForm();
        },
        (error) => {
          this.messageService.addError('Account has not been created!')
          this.registerErrors = error;
          if (error.includes('password')) {
            this.registerForm.controls.password.setErrors({ password: true });
            this.registerForm.controls.confirmPassword.setErrors({ confirmPassword: true });
          }
          if (error.includes('email')) {
            this.registerForm.controls.email.setErrors({ email: true });
          }
        }
      );
    }
  }


  get f() {
    return this.loginForm.controls;
  }

  public onLogin() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

   // this.loading = true;
    this.authenticationService
      .login(this.f.email.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        () => {
         this.authenticationService.getAccount().pipe(first()).subscribe(
          (data) => {
               //console.log(data)
          })
         this.messageService.add("Login successful!");
         this.router.navigate([this.returnUrl]);
        },
        (error) => {
          this.messageService.addError(error.error.message);
        }
      );
  }
}
