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
  constructor(public snackBar: MdSnackBar, private http: Http, private router: Router, private httpService: HttpService) { }
  next() {
    if (this.verifyEmailFormat(this.email)) {
      if (this.verifyPasswords(this.password, this.repeatPassword)) {
        console.log("ok");
      } else {
        this.openSnackBar("Your password must be at least 8 characters long", "ok")
      }
    } else {
      this.openSnackBar("Invalid email", "ok")
    }
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
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
    console.log(email);
    let re = /\S+@\S+\.\S+/;
    return re.test(email);
  }
  verifyPasswords(password1: string, password2: string) {
    return !(!password1 || !password2 || password1 != password2 || password1.length < 8);
  }
  ngOnInit() {
  }
  getAccountInfo() {
    return { email: this.email, password: this.password };
  }

}
