import { Component, OnInit } from '@angular/core';
import { ProfileViewComponent } from '../profile-view/profile-view.component';
import { Router, ActivatedRoute } from '@angular/router';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { NewEventDialogComponent } from '../new-event-dialog/new-event-dialog.component';
import { EditProfileDialogComponent } from '../edit-profile-dialog/edit-profile-dialog.component';
import { HttpService } from '../http.service';
import { OwnerService } from '../owner.service';
@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  rerender: boolean = true;
  constructor(private ownerService: OwnerService, private httpService: HttpService, private route: ActivatedRoute, public dialog: MdDialog, private router: Router) { }
  profileId: number;
  canSee: boolean = false;
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.profileId = +params['id'];
      this.ownerService.isOwned(this.profileId).then(response => {
        console.log(response);
        if (response == true) {
          this.canSee = true;
        } else {
          this.canSee = false;
        }
      })
    })
  }
  openDialog() {
    let dialogRef = this.dialog.open(NewEventDialogComponent, {
      data: {
        owner: this.profileId
      }
    });
    dialogRef.afterClosed().subscribe(newEvent => {
      console.log(newEvent);
      return this.uploadMedia(newEvent).then(response => {
      }).then(_ => {
        return this.httpService.addEvent(newEvent);
      }).then(response => {
        event = null;
        return Promise.resolve("Event posted");
      }).then(_ => {
        window.location.reload();
      })
    });
  }

  deleteProfile() {
    this.httpService.delete(this.profileId).then(response => {
      this.router.navigateByUrl("owned");
    })
  }

  redirectToTree() {
    this.router.navigateByUrl("tree/" + this.profileId);
  }

  edit() {
    let body;
    this.httpService.getProfile(this.profileId).then(res => body = res.json()).then(_ => {
      let dialogRef = this.dialog.open(EditProfileDialogComponent, {
        data: body
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.httpService.updateProfile(result, this.profileId).then(_ => {
            window.location.reload();
          })
        }
      });
    })
  }
  uploadMedia(newEvent): Promise<string> {
    newEvent.media = [];
    return Promise.all(newEvent.files.map(file => {
      console.log(file.name)
      return this.httpService.upload(file).then(response => {
        newEvent.media.push({ type: response.type, path: response.path, postid: response.postid });
      })
    })
    ).then(_ => {
      delete newEvent.files;
      return Promise.resolve("Media upload finished");
    })
  }

}
