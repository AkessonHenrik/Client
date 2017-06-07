import { Component, Input, OnInit } from '@angular/core';
import { LocationComponent } from '../location/location.component';
import { MediaComponent, VideoComponent, ImageComponent } from '../profile-view/profile-view.component';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent {
  @Input('event') event: EventComponent;
  id: number;
  name: string;
  description: string;
  time: string[];

  media: { type: string, path: string }[];

  constructor() { }

}


@Component({
  selector: 'app-work-event',
  template: '',
  styles: ['']
})
export class WorkEventComponent extends EventComponent {
  company: string;
  position: string;
  location: LocationComponent;
}
@Component({
  selector: 'app-life-event',
  template: `
    <app-event *ngIf="life !== undefined" [event]="event"></app-event>
  `,
  styles: ['']
})
@Component({})
export class LifeEventComponent extends EventComponent implements OnInit {
  @Input('life') life:
  {
    "id": number,
    "name": string,
    "description": string,
    "time": string[],
    "born": { "city": string, "province": string, "country": string },
    "died": { "city": string, "province": string, "country": string },
    "media": [{ "type": string, "path": string }]
  }

  locations: LocationComponent[] = [];

  event: EventComponent;

  ngOnInit() {
    console.log("LIFE=======================")
    console.log(this.life)
    console.log("=======================")
    this.locations.push(new LocationComponent(this.life.born.city, this.life.born.province, this.life.born.country));
    if (this.life.died !== null) {
      this.locations.push(new LocationComponent(this.life.died.city, this.life.died.province, this.life.died.country));
    }
    this.event = new EventComponent;
    console.log(this.event)
    this.event.id = this.life.id;
    this.event.description = this.life.description;
    this.event.name = this.life.name;
    this.event.time = this.life.time;
    this.event.media = this.life.media;
  }
}