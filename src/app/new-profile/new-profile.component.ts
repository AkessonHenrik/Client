import { Output, EventEmitter, Input, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, RequestOptions, Headers } from '@angular/http';
import * as globals from '../globals';
@Component({
  selector: 'app-new-profile',
  templateUrl: './new-profile.component.html',
  styleUrls: ['./new-profile.component.css']
})
export class NewProfileComponent implements OnInit {
  @Output() onSubmit: EventEmitter<any> = new EventEmitter<any>();
  firstname: string;
  lastname: string;
  born: { name: string, description: string, location: { city: string, province: string, country: string }, media: string[] } = { name: "Birth", description: "", location: { city: "", province: "", country: "" }, media: [] };
  died: { name: string, description: string, location: { city: string, province: string, country: string }, media: string[] } = { name: "", description: "", location: { city: "", province: "", country: "" }, media: [] };
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
  constructor(private http: Http) { }
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
      let formData: FormData = new FormData();
      formData.append('picture', this.file, this.file.name);
      let headers = new Headers();
      headers.append('Accept', 'application/json');
      let options = new RequestOptions({ headers: headers });
      this.http.post(globals.server + "/upload", formData, options)
        .toPromise().then(response => {
          this.pictureUrl = globals.fileEndpoint + response.json();
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
    }
  }
}
