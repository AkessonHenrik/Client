import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MdSnackBar } from '@angular/material';
import { MdSnackBarConfig } from '@angular/material';
import { ViewEncapsulation } from '@angular/core';
import * as globals from '../globals';
import { HttpService } from '../http-service.service';
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  constructor(private router: Router, private httpService: HttpService) { }
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
    this.router.navigateByUrl('/login');
  }
  redirectToMyProfile() {
    this.router.navigateByUrl('/profilePage/' + globals.getUserId());
  }
}