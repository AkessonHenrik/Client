import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import * as globals from '../globals';
@Component({
  selector: 'app-claim',
  templateUrl: './claim.component.html',
  styleUrls: ['./claim.component.css']
})
export class ClaimComponent implements OnInit {

  constructor(private httpService: HttpService) { }
  claims = [];
  ngOnInit() {
    this.httpService.getClaims(globals.getUserId()).then(response => {
      console.log(response);
      this.claims = response.json();
    })
  }

  approveClaim(claimId: number) {
    this.httpService.approveClaim(claimId).then(_ => {
      this.claims = this.claims.filter(claim => claim.id !== claimId);
    })
  }

  refuseClaim(claimId: number) {
    this.httpService.refuseClaim(claimId).then(_ => {
      this.claims = this.claims.filter(claim => claim.id !== claimId);
    })
  }

}
