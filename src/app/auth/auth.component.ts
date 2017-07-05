import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { Http } from '@angular/http';
import { RequestOptions, Request, RequestMethod } from '@angular/http';
import * as globals from '../globals';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  email: string = "";
  password: string = "";
  errorMessage: string = "";
  constructor(private router: Router, private http: Http) { }

  ngOnInit() {
  }

  login() {
    if (this.email !== "" && this.password !== "") {
      let credentials = { "email": this.email, "password": this.password }
      console.log(credentials);
      this.http.post(globals.server + "/auth", {
        email: this.email,
        password: this.password
      }).toPromise().then(response => {
        console.log(response);
        let body = response.json();
        localStorage["treemily_id"] = body.profileid;
        localStorage["treemily_email"] = body.email;
        this.router.navigateByUrl("/tree/" + body.profileid);
      }).catch(error => {
        if (error.status === 404) {
          this.errorMessage = "Invalid email, try again"

        } else if (error.status === 400) {
          this.errorMessage = "Wrong password, try again"
        }
        setTimeout(() => {
          this.errorMessage = "";
        }, 3000)
      })
    }
  }

}
