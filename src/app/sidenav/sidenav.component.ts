import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MdSnackBar, MdSidenav } from '@angular/material';
import { MdSnackBarConfig } from '@angular/material';
import { ViewEncapsulation } from '@angular/core';
import * as globals from '../globals';
import { HttpService } from '../http.service';
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  constructor(private router: Router, private httpService: HttpService) { }
  searchingToggled: boolean = false;
  searchInput: string = ""
  @ViewChild('start') public myNav: MdSidenav;

  ngOnInit() {
    this.goToHomePage();
  }
  goToHomePage() {
    if (globals.loggedIn()) {
      this.redirectToMyTree();
    } else {
      this.login();
    }
  }
  redirectToMyTree() {
    this.router.navigate(['/tree/', globals.getUserProfileId()]);
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
    let firstname = value.substring(0, value.indexOf(" "));
    let lastname = value.substring(value.indexOf(" ") + 1);
    console.log("-" + firstname + "-")
    console.log("-" + lastname + "-")
    this.httpService.search(firstname, lastname).then(r => console.log(r))
  }
  focusOutFunction() {
    this.searchingToggled = false;
  }
  logout() {
    delete localStorage["treemily_id"];
    delete localStorage["treemily_email"];
    delete localStorage["treemily_profileid"];
    this.myNav.close();
    this.router.navigateByUrl('/login');
  }
  getUserEmail() {
    return localStorage["treemily_email"];
  }
  redirectToMyProfile() {
    this.router.navigateByUrl('/profilePage/' + globals.getUserProfileId());
  }

  redirectToMyNotifications() {
    this.router.navigateByUrl("/notifications");
  }

  redirectToMyClaims() {
    this.router.navigateByUrl('/claims')
  }
  modifyAccount() {
    this.router.navigateByUrl('/accountSettings');
  }
  redirectToMyGroups() {
    this.router.navigateByUrl("/groups");
  }
}