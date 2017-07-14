import { Component, OnInit } from '@angular/core';
import { MdSnackBar } from '@angular/material';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import * as globals from '../globals';
import { HttpService } from '../http-service.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  email: string;
  password: string;
  repeatPassword: string;
  choice: string;
  profileSearchFirstname: string;
  profileSearchLastname: string;
  activeTab: number = 0;
  errorMessage: string = "";
  profiles = [];
  searched: boolean = false;
  constructor(private router: Router, private httpService: HttpService) { }
  next() {
    console.log(this.choice);
    if (this.verifyEmailFormat(this.email)) {
      if (this.verifyPasswords(this.password, this.repeatPassword)) {
        if (this.choice) {
          if (this.choice === 'new') {
            this.activeTab = 1;
          } else if (this.choice === 'existing') {
            this.activeTab = 2;
          }
        } else {
          this.errorMessage = "Choose a profile option below";
        }
      } else {
        this.errorMessage = "Your password must be at least 8 characters long"
      }
    } else {
      this.errorMessage = "Invalid email format";
    }
  }

  createAccountAndProfile(profileData) {
    this.httpService.createProfile(profileData).then(id => {
      this.httpService.createAccount({
        profileId: id,
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
  verifyPasswords(password1: string, password2: string) {
    return !(!password1 || !password2 || password1 != password2 || password1.length < 8);
  }
  ngOnInit() {
    // this.activeTab = 2;
    // this.profileSearchFirstname = "Henrik";
    // this.profileSearchLastname = "Akesson";
    // this.search();
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
    });
  }

  onTabSelect($event: any) {
    this.searched = false;
  }
}
