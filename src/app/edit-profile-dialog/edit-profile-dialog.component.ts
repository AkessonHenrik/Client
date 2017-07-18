import { Component, OnInit, Inject } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { HttpService } from '../http.service';
import { NewProfileComponent } from '../new-profile/new-profile.component';
@Component({
  selector: 'app-event-dialog',
  templateUrl: './edit-profile-dialog.component.html',
  styleUrls: ['./edit-profile-dialog.component.css']
})
export class EditProfileDialogComponent implements OnInit {
  initialProfile;
  ngOnInit() {
  }
  constructor(public dialogRef: MdDialogRef<EditProfileDialogComponent>, @Inject(MD_DIALOG_DATA) private data, private httpService: HttpService) {
    this.initialProfile = this.data;
  }
  submit(event) {
    console.log("EVENT")
    console.log(event);
    console.log("initial profile")
    console.log(this.initialProfile);

    let returnResult = {};
    if (event.firstname && event.firstname.length > 0 && event.firstname !== this.initialProfile.profile.firstname) {
      returnResult["firstname"] = event.firstname
    }
    if (event.lastname && event.lastname.length > 0 && event.lastname !== this.initialProfile.profile.lastname) {
      returnResult["lastname"] = event.lastname
    }
    if (event.gender !== this.initialProfile.profile.gender) {
      returnResult["gender"] = event.gender;
    }
    // Compare birthday
    let eventBirthDay = event.birthDay.split("-");
    let initialBirthDay = this.initialProfile.born.time[0].split("-")
    if (+eventBirthDay[2] !== +initialBirthDay[0] || +eventBirthDay[1] !== +initialBirthDay[1] || +eventBirthDay[0] !== +initialBirthDay[2]) {
      console.log("Different births: " + eventBirthDay + ", " + initialBirthDay);
      returnResult["birthDay"] = event.birthDay
    }

    // Compare deathday
    if (event.deathDay) {
      let eventDeathDay = event.deathDay.split("-")
      if (this.initialProfile.died) {
        let initialDeathDay = this.initialProfile.died.time[0].split("-")
        if (+eventDeathDay[2] !== +initialDeathDay[0] || +eventDeathDay[1] !== +initialDeathDay[1] || +eventDeathDay[0] !== +initialDeathDay[2]) {
          console.log("Different deaths: " + eventDeathDay + ", " + initialDeathDay);
          returnResult["deathDay"] = event.deathDay
        }
      } else {
        returnResult["deathDay"] = event.deathDay
      }
    } else {
      console.log("No death day")
    }

    // Compare born locations
    if (!this.compareLocations(event.born.location, this.initialProfile.born.location)) {
      returnResult["born"] = event.born;
    }
    // Compare died locations
    if (event.died) {
      if (this.initialProfile.died === null) {
        console.log("Added died")
        returnResult["died"] = event.died;
      } else {
        console.log("Was dead already");
        if (this.initialProfile.died.description !== event.died.description || !this.compareLocations(this.initialProfile.died.location, event.died.location)) {
          returnResult["died"] = event.died;
        }
      }
    }
    // Compare profile picture
    if (event.profilePicture) {
      if (event.profilePicture !== this.initialProfile.profile.image) {
        console.log("Different images!")
        returnResult["image"] = event.profilePicture;
      }
    }
    console.log(returnResult)
    this.dialogRef.close(returnResult);
  }
  compareLocations(loc1: { city: string, province: string, country: string }, loc2: { city: string, province: string, country: string }): boolean {
    console.log(loc1);
    console.log(loc2);
    return loc1.city === loc2.city && loc1.province === loc2.province && loc1.country === loc2.country;
  }
}
