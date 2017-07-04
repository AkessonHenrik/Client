import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MdSnackBar } from '@angular/material';
import { MdSnackBarConfig } from '@angular/material';
import { ViewEncapsulation } from '@angular/core';
import * as globals from '../globals';
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
  redirectToMyTree() {
    this.router.navigate(['/tree/', globals.getUserId()]);
  }
  redirectToNewTree() {
    this.router.navigateByUrl('/newTree')
  }
  redirectToOwnedProfiles() {
    this.router.navigateByUrl('/owned');
  }
  loggedIn() {
    return localStorage["treemily_id"] !== undefined
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