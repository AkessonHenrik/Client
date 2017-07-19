import { Output, EventEmitter, Input, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, RequestOptions, Headers } from '@angular/http';
import * as globals from '../globals';
import { HttpService } from '../http.service';
@Component({
  selector: 'app-new-profile',
  templateUrl: './new-profile.component.html',
  styleUrls: ['./new-profile.component.css']
})
export class NewProfileComponent implements OnInit {
  @Output() onSubmit: EventEmitter<any> = new EventEmitter<any>();
  @Input() initialProfile; // For profile editing
  firstname: string;
  lastname: string;
  born: { name: string, description: string, location: { city: string, province: string, country: string }, media: string[] } = { name: "born", description: "", location: { city: "", province: "", country: "" }, media: [] };
  died: { name: string, description: string, location: { city: string, province: string, country: string }, media: string[] } = { name: "died", description: "", location: { city: "", province: "", country: "" }, media: [] };
  birthDay: string;
  gender: number;
  birthDayDay: number;
  birthDayMonth: number;
  birthDayYear: number;
  deathDay: string;
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
    if (this.initialProfile) {
      this.firstname = this.initialProfile.profile.firstname;
      this.lastname = this.initialProfile.profile.lastname;
      this.gender = this.initialProfile.profile.gender;
      this.born.name = this.initialProfile.born.name;
      this.born.description = this.initialProfile.born.description;
      this.born.location.city = this.initialProfile.born.location.city;
      this.born.location.province = this.initialProfile.born.location.province;
      this.born.location.country = this.initialProfile.born.location.country;
      this.born.media = this.initialProfile.born.media;
      this.birthDay = this.initialProfile.born.time[0];
      let values = this.birthDay.split("-");
      this.birthDayYear = +(values[0]);
      this.birthDayMonth = +(values[1]);
      this.birthDayDay = +(values[2]);
      if (this.initialProfile.died !== null && this.initialProfile.died !== undefined) {
        this.died.description = this.initialProfile.died.description;
        this.died.location.city = this.initialProfile.died.location.city;
        this.died.location.province = this.initialProfile.died.location.province;
        this.died.location.country = this.initialProfile.died.location.country;
        this.deathDay = this.initialProfile.died.time[0];
        let values = this.deathDay.split("-");
        this.deathDayYear = +(values[0]);
        this.deathDayMonth = +(values[1]);
        this.deathDayDay = +(values[2]);
      }
    }
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
        this.pictureUrl = globals.fileEndpoint + response.path;
      }).then(_ => {
        this.born.description = this.firstname + " is born"
        let returnObject = {
          firstname: this.firstname,
          lastname: this.lastname,
          gender: this.gender,
          profilePicture: this.pictureUrl,
          birthDay: this.birthDayDay + "-" + this.birthDayMonth + "-" + this.birthDayYear,
          born: this.born
        }
        if (this.deathDayDay) {
          returnObject["died"] = this.died;
          returnObject["deathDay"] = this.deathDayDay + "-" + this.deathDayMonth + "-" + this.deathDayYear;
        }
        this.onSubmit.emit(returnObject);
      })
    } else {
      console.log("Gender! " + this.gender)
      console.log(this.genders[this.gender])
      let g = this.genders[this.gender]
      this.born.description = this.firstname + " is born"
      let returnObject = {
        firstname: this.firstname,
        lastname: this.lastname,
        gender: this.gender,
        birthDay: this.birthDayDay + "-" + this.birthDayMonth + "-" + this.birthDayYear,
        born: this.born
      }
      if (this.deathDayDay) {
        returnObject["died"] = this.died;
        returnObject["deathDay"] = this.deathDayDay + "-" + this.deathDayMonth + "-" + this.deathDayYear;
      }
      this.onSubmit.emit(returnObject);
    }
  }
}
