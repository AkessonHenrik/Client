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

export class WorkEventComponent extends EventComponent {
  company: string;
  position: string;
  location: LocationComponent;
}