import { Component, OnInit } from '@angular/core';
import { PasswordValidity } from '../signup/signup.component';
import { HttpService } from '../http.service';
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  email: string;
  password: string = "";
  repeatPassword: string = "";
  errorMessage: string;
  constructor(private httpService: HttpService) { }

  ngOnInit() {
    this.email = localStorage["treemily_email"]
  }

  update() {
    let newAccountInfo = {};

    if (this.email.length > 0) {
      if (this.verifyEmailFormat(this.email)) {
        newAccountInfo["email"] = this.email;
      } else {
        this.errorMessage = "Invalid email format";
        return;
      }
    }
    if (this.password.length > 0) {
      let passwordValidation = this.verifyPasswords(this.password, this.repeatPassword);
      switch (passwordValidation) {
        case PasswordValidity.Correct: {
          newAccountInfo["password"] = this.password;
          this.errorMessage = "";
          break;
        }
        case PasswordValidity.NoPassword: {
          this.errorMessage = "Please provide a password"
          return;
        }
        case PasswordValidity.NoMatch: {
          this.errorMessage = "Passwords don't match"
          return;
        }
        case PasswordValidity.TooShort: {
          this.errorMessage = "Your password must be at least 8 characters long"
          return;
        }
      }
    }
    this.httpService.updateAccount(newAccountInfo).then(response => {
      console.log(response);
      if (response.status === 200)
        localStorage["treemily_email"] = this.email;
    }).catch(error => {
      this.errorMessage = error._body
      console.log(error);
    })
  }
  verifyEmailFormat(email: string) {
    let re = /\S+@\S+\.\S+/;
    return re.test(email);
  }
  verifyPasswords(password1: string, password2: string): PasswordValidity {
    if (!password1 || !password2) {
      return PasswordValidity.NoPassword;
    } else if (password1 !== password2) {
      return PasswordValidity.NoMatch;
    } else if (password1.length < 8) {
      return PasswordValidity.TooShort;
    } else {
      return PasswordValidity.Correct;
    }
  }
}
