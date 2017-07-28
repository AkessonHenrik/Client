import { Component, Input, OnInit } from '@angular/core';
import { LocationComponent } from '../location/location.component';
import { MediaViewerComponent } from '../media-viewer/media-viewer.component';
import * as globals from '../globals';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { EventDialog } from '../tree/dialogs/eventDialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent {
  @Input('event') event: EventComponent;
  @Input('dialog') dialog: MdDialog;
  @Input('disabled') disabled: boolean = false;
  id: number;
  name: string;
  description: string;
  owner: number;
  time: string[];
  media: { type: string, path: string, postid: number }[] = [];

  openEvent() {
    console.log("Opening: " + this.event.id)
    this.dialog.open(EventDialog, {
      data: { id: this.event.id, relationship: false, event: true }
    })
  }

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

  addMedia(media: { type: string, path: string, postid: number }) {
    this.media.push(media);
  }

  initialize(data) {
    this.id = data.id;
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
  <h1 class="eventType">Work Event</h1>
  <app-event [event]="event" [dialog]="dialog" [disabled]="disabled"></app-event>
  <h2>Position: {{event.position}} Company: {{event.company}}</h2>
  <h2>{{event.location.city}}, {{event.location.province}}, {{event.location.country}}</h2>
  </div>
  `,
  styles: ['./event.component.css']
})
export class WorkEventComponent extends EventComponent implements OnInit {
  @Input('event') event: WorkEventComponent;
  @Input('dialog') dialog: MdDialog;
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
  <h1 class="eventType">Located Event</h1>  
  <app-event [event]="event" [dialog]="dialog" [disabled]="disabled"></app-event>
  <h2>{{event.location.city}}, {{event.location.province}}, {{event.location.country}}</h2>
  </div>
  `,
  styles: ['./event.component.css']
})
export class LocatedEventComponent extends EventComponent implements OnInit {
  @Input('event') event: LocatedEventComponent;
  @Input('dialog') dialog: MdDialog;
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
  <h1 class="eventType">Move Event</h1>    
  <app-event [event]="event" [dialog]="dialog" [disabled]="disabled"></app-event>
  <h2>{{event.location.city}}, {{event.location.province}}, {{event.location.country}}</h2>
  </div>
  `,
  styles: ['./event.component.css']
})
export class MoveEventComponent extends EventComponent implements OnInit {
  @Input('event') event: MoveEventComponent;
  @Input('dialog') dialog: MdDialog;
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