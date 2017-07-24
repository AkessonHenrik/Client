import { Component, OnInit } from '@angular/core';
import { MdSnackBar } from '@angular/material';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import * as globals from '../globals';
import { HttpService } from '../http.service';
enum PasswordValidity {
  Correct = 1,
  NoMatch,
  TooShort,
  NoPassword
}
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  email: string;
  password: string;
  repeatPassword: string;
  choice: number;
  profileSearchFirstname: string;
  profileSearchLastname: string;
  activeTab: number = 0;
  errorMessage: string = "";
  profiles = [];
  searched: boolean = false;
  constructor(private router: Router, private httpService: HttpService) { }
  next() {
    console.log(this.email);
    if (this.verifyEmailFormat(this.email)) {
      let passwordValidation = this.verifyPasswords(this.password, this.repeatPassword);
      switch (passwordValidation) {
        case PasswordValidity.Correct: {
          if (!this.choice || this.choice <= 0) {
            this.errorMessage = "Choose a profile option below";
          } else {
            this.activeTab = this.choice;
          }
          break;
        }
        case PasswordValidity.NoPassword: {
          this.errorMessage = "Please provide a password"
          break;
        }
        case PasswordValidity.NoMatch: {
          this.errorMessage = "Passwords don't match"
          break;
        }
        case PasswordValidity.TooShort: {
          this.errorMessage = "Your password must be at least 8 characters long"
          break;
        }
      }
    } else {
      this.errorMessage = "Invalid email format";
    }

  }

  createAccountAndProfile(profileData) {
    console.log(profileData);
    this.httpService.createProfile(profileData).then(response => {
      this.httpService.createAccount({
        profileId: response.id,
        email: this.email,
        password: this.password
      }).toPromise().then(response => {
        console.log(response);
        localStorage["treemily_id"] = response.json().profileid
        localStorage["treemily_email"] = response.json().email
      }).then(_ => {
        this.router.navigateByUrl('tree/' + localStorage["treemily_id"]);
      })
    })
  }

  verifyEmailFormat(email: string) {
    let re = /\S+@\S+\.\S+/;
    return re.test(email);
  }
  verifyPasswords(password1: string, password2: string): PasswordValidity {
    // return !(!password1 || !password2 || password1 != password2 || password1.length < 8);
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
  ngOnInit() {
  }
  getAccountInfo() {
    return { email: this.email, password: this.password };
  }

  search() {
    this.searched = false;
    this.profiles = [];
    this.httpService.search(this.profileSearchFirstname, this.profileSearchLastname).then(result => {
      this.profiles = result;
      if (this.profiles.length === 0) {
        this.searched = true;
      }
    })
  }
  claim(id) {
    this.httpService.createAccount({
      profileId: id,
      email: this.email,
      password: this.password,
    }).toPromise().then(response => {
      console.log(response);
      this.router.navigateByUrl('login')
    });
  }

  onTabSelect($event: any) {
    this.searched = false;
  }
}
