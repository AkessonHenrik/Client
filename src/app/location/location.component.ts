import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent {
  city: string;
  province: string;
  country: string;
  constructor(city: string, province: string, country: string) {
    this.city = city;
    this.province = province;
    this.country = country;
  }

  toString() {
    return this.city + ", " + this.province + ", " + this.country;
  }
}
