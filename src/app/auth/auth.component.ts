import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { Http } from '@angular/http';
import { RequestOptions, Request, RequestMethod } from '@angular/http';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  email: string;
  password: string;

  constructor(private router: Router, private http: Http) { }

  ngOnInit() {
  }
  
  login() {
    let credentials = { "email": this.email, "password": this.password }
    console.log(credentials);
  }

}
