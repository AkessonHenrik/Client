import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MdSnackBar } from '@angular/material';
import { MdSnackBarConfig } from '@angular/material';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  constructor(private router: Router) { }
  searchingToggled: boolean = false;
  searchInput: string = ""
  ngOnInit() {
  }
  redirectToTree() {
    this.router.navigateByUrl('/tree');
  }
  loggedIn(): boolean {
    return localStorage['treemily_credentials'] !== undefined;
  }
  login() {
    this.router.navigateByUrl('/login');
  }
  signup() {
    this.router.navigateByUrl('/signup')
  }
  toggleSearch() {
    console.log("Launch search")
    this.searchingToggled = true;
  }
  launchSearch(value: string) {
    console.log("Searching for " + value);
  }
  focusOutFunction() {
    this.searchingToggled = false;
  }
}