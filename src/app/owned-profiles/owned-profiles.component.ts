import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import * as globals from '../globals';
@Component({
  selector: 'app-owned-profiles',
  templateUrl: './owned-profiles.component.html',
  styleUrls: ['./owned-profiles.component.css']
})
export class OwnedProfilesComponent implements OnInit {

  constructor(private http: Http, private router: Router) { }
  profiles = [];
  ngOnInit() {
    this.http.get(globals.server + "/owned/" + globals.getUserId()).toPromise().then(response => {
      this.profiles = response.json()
    })
  }
  goToTree(id: number) {
    this.router.navigateByUrl('tree/' + id)
  }
  getGender(gender: number) {
    return globals.getGender(gender);
  }

}
