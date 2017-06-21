import { Output, EventEmitter, Input, Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
@Component({
  selector: 'app-new-profile',
  templateUrl: './new-profile.component.html',
  styleUrls: ['./new-profile.component.css']
})
export class NewProfileComponent implements OnInit {
  @Output() onSubmit: EventEmitter<any> = new EventEmitter<any>();
  firstname: string;
  lastname: string;
  born: { name: string, description: string, location: { city: string, province: string, country: string }, media: string[] } = { name: "", description: "", location: { city: "", province: "", country: "" }, media: [] };
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

  constructor(private http: Http) { }

  verifyDates(): boolean {
    return true;
  }
  ngOnInit() {
  }
  submit() {
    this.onSubmit.emit({
      firstName: this.firstname,
      lastName: this.lastname,
      gender: this.gender,
      profilePicture: "http://www.wikiality.com/file/2016/11/bears1.jpg",
      birthDay: this.birthDayDay + "-" + this.birthDayMonth + "-" + this.birthDayYear,
      deathDay: this.deathDayDay + "-" + this.deathDayMonth + "-" + this.deathDayYear,
      born: this.born,
      died: this.died
    });
  }

}
