import { Component, OnInit } from '@angular/core';
import { ProfileViewComponent } from '../profile-view/profile-view.component';
import { Router, ActivatedRoute } from '@angular/router';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { NewEventDialogComponent } from '../new-event-dialog/new-event-dialog.component';
@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  rerender: boolean = true;
  constructor(private route: ActivatedRoute, public dialog: MdDialog, private router: Router) { }
  profileId: number;
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.profileId = +params['id'];
    })
  }
  openDialog() {
    let dialogRef = this.dialog.open(NewEventDialogComponent, {
      data: {
        owner: this.profileId
      }
    });
    dialogRef.afterClosed().subscribe(_ => {
      this.rerender = false;
      this.rerender = true;
    });
  }
  redirectToTree() {
    this.router.navigateByUrl("tree/" + this.profileId);
  }
}
