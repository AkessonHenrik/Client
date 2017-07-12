import { Output, EventEmitter, Input, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, RequestOptions, Headers } from '@angular/http';
import * as globals from '../globals';
import { HttpService } from '../http-service.service';
@Component({
  selector: 'app-new-profile',
  templateUrl: './new-profile.component.html',
  styleUrls: ['./new-profile.component.css']
})
export class NewProfileComponent implements OnInit {
  @Output() onSubmit: EventEmitter<any> = new EventEmitter<any>();
  firstname: string;
  lastname: string;
  born: { name: string, description: string, location: { city: string, province: string, country: string }, media: string[] } = { name: "born", description: "", location: { city: "", province: "", country: "" }, media: [] };
  died: { name: string, description: string, location: { city: string, province: string, country: string }, media: string[] } = { name: "died", description: "", location: { city: "", province: "", country: "" }, media: [] };
  birthDay: string;
  gender: string;
  birthDayDay: number;
  birthDayMonth: number;
  birthDayYear: number;
  deathDay: number;
  deathDayDay: number;
  deathDayMonth: number;
  deathDayYear: number;
  genders: string[] = ["male", "female", "other"];
  constructor(private httpService: HttpService) { }
  pictureUrl: string;
  file: File;
  verifyDates(): boolean {
    return true;
  }
  ngOnInit() {
  }
  fileChange(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.file = fileList[0];
    }
  }
  submit() {
    if (this.file) {
      this.httpService.upload(this.file).then(response => {
        this.pictureUrl = globals.fileEndpoint + response;
      }).then(_ => {
        this.born.description = this.firstname + " is born"

        this.onSubmit.emit({
          firstName: this.firstname,
          lastName: this.lastname,
          gender: this.genders.indexOf(this.gender),
          profilePicture: this.pictureUrl,
          birthDay: this.birthDayDay + "-" + this.birthDayMonth + "-" + this.birthDayYear,
          deathDay: this.deathDayDay + "-" + this.deathDayMonth + "-" + this.deathDayYear,
          born: this.born,
          died: this.died
        });
      })
    } else {
      let profilePic = "";
      console.log(this.gender);
      if (this.gender === "male") {
        profilePic = "http://s3.amazonaws.com/37assets/svn/765-default-avatar.png";
      } else if (this.gender === "other") {
        profilePic = "https://maxcdn.icons8.com/Share/icon/Alphabet//question_mark1600.png";
      } else {
        profilePic = "https://singlesdatingworld.com/images/woman.jpg";
      }
      // switch (this.gender) {
      //   case "male": {
      //     profilePic = "http://s3.amazonaws.com/37assets/svn/765-default-avatar.png";
      //     break;
      //   }
      //   case "female": {
      //     profilePic = "https://maxcdn.icons8.com/Share/icon/Alphabet//question_mark1600.png"
      //     break;
      //   }
      //   case "other": {
      //     profilePic = "https://maxcdn.icons8.com/Share/icon/Alphabet//question_mark1600.png"
      //     break;
      //   }

      // }
      this.onSubmit.emit({
        firstName: this.firstname,
        lastName: this.lastname,
        gender: this.genders.indexOf(this.gender),
        profilePicture: profilePic,
        birthDay: this.birthDayDay + "-" + this.birthDayMonth + "-" + this.birthDayYear,
        deathDay: this.deathDayDay + "-" + this.deathDayMonth + "-" + this.deathDayYear,
        born: this.born,
        died: this.died
      });
    }
  }
}
