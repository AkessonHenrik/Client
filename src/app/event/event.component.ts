import { Component, Input, OnInit } from '@angular/core';
import { LocationComponent } from '../location/location.component';
import { MediaComponent, VideoComponent, ImageComponent } from '../profile-view/profile-view.component';
import { MediaViewerComponent } from '../media-viewer/media-viewer.component';
import * as globals from '../globals';

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
  owner: number;
  time: string[];
  media: { type: string, path: string }[] = [];
  getType() { return "Event"; }
  getAsObject() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      time: this.time,
      media: this.media,
      type: this.getType(),
      owner: this.owner
    }
  }

  addMedia(media: { type: string, path: string }) {
    console.log("Adding media");
    this.media.push(media);
    console.log("Added media");
    console.log(this.media);
  }
  initialize(data) {
    this.name = data.name;
    this.description = data.description;
    this.owner = data.owner;
    this.time = data.time;
    this.media = data.media;
  };
}


@Component({
  selector: 'app-work-event',
  template: `
  <div class="event" *ngIf="event !== undefined">
  <h1>Work Event</h1>
  <app-event [event]="event"></app-event>
  Position: {{event.position}} Company: {{event.company}}
  {{event.location.city}}, {{event.location.province}}, {{event.location.country}}
  </div>
  `,
  styles: ['./event.component.css']
})
export class WorkEventComponent extends EventComponent implements OnInit {
  @Input('event') event: WorkEventComponent;
  company: string;
  position: string;
  location: LocationComponent;
  getType() { return "WorkEvent"; }
  getAsObject() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      time: this.time,
      media: this.media,
      type: this.getType(),
      location: this.location.toObject(),
      owner: this.owner,
      company: this.company,
      position: this.position
    }
  }
  ngOnInit() {
    console.log(this.event);
  }
}

@Component({
  selector: 'app-located-event',
  template: `
  <div class="event" *ngIf="event !== undefined">
  <h1>Located Event</h1>  
  <app-event [event]="event"></app-event>
  {{event.location.city}}, {{event.location.province}}, {{event.location.country}}
  </div>
  `,
  styles: ['./event.component.css']
})
export class LocatedEventComponent extends EventComponent implements OnInit {
  @Input('event') event: LocatedEventComponent;
  location: LocationComponent;
  getType() { return "LocatedEvent"; }

  ngOnInit() { }
  getAsObject() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      time: this.time,
      media: this.media,
      type: this.getType(),
      location: this.location.toObject(),
      owner: this.owner
    }
  }
  initialize(data) {
    this.location = data.location;
    super.initialize(data);
  }
}

@Component({
  selector: 'app-move-event',
  template: `
  <div class="event" *ngIf="event !== undefined">
  <h1>Move Event</h1>    
  <app-event [event]="event"></app-event>
  {{event.location.city}}, {{event.location.province}}, {{event.location.country}}
  </div>
  `,
  styles: ['./event.component.css']
})
export class MoveEventComponent extends EventComponent implements OnInit {
  @Input('event') event: MoveEventComponent;
  location: LocationComponent;
  getType() { return "MoveEvent"; }
  ngOnInit() {
  }
  getAsObject() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      time: this.time,
      media: this.media,
      type: this.getType(),
      location: this.location.toObject(),
      owner: this.owner
    }
  }
}