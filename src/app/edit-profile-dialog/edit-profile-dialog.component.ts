import { Component, OnInit, Inject } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { HttpService } from '../http.service';
@Component({
  selector: 'app-event-dialog',
  templateUrl: './edit-profile-dialog.component.html',
  styleUrls: ['./edit-profile-dialog.component.css']
})
export class EditProfileDialogComponent implements OnInit {

  newFirstname: string;
  newLastname: string;
  newProfilePicture: File = null;

  ngOnInit() {
  }
  constructor(public dialogRef: MdDialogRef<EditProfileDialogComponent>, private httpService: HttpService) { }
  removeFile() {
    this.newProfilePicture = null;
  }
  fileChange(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      console.log("New profile pic")
      this.newProfilePicture = fileList[0];
    }
  }
  submit() {
    let returnResult = {};
    if (this.newFirstname) {
      returnResult["firstname"] = this.newFirstname;
    }
    if (this.newLastname) {
      returnResult["lastname"] = this.newLastname;
    }
    if (this.newProfilePicture) {
      this.httpService.upload(this.newProfilePicture).then(response => {
        console.log(response);
        returnResult["profilePicture"] = response.path;
      }).then(_ => {
        console.log(returnResult);
        this.dialogRef.close(returnResult);
      })
    } else {
      this.dialogRef.close(returnResult);
    }
  }
}
