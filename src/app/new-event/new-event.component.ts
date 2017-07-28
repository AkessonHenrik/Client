import { Component, Output, Input, EventEmitter, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { LocationComponent } from '../location/location.component';
import { EventComponent, LocatedEventComponent, WorkEventComponent, MoveEventComponent } from '../event/event.component';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';
import { VisibilityComponent } from '../visibility/visibility.component';
@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.component.html',
  styleUrls: ['./new-event.component.css']
})
export class NewEventComponent implements OnInit {

  @Output('onSubmit') onSubmit: EventEmitter<any> = new EventEmitter<any>();
  @Input('owner') owner: number;
  @Input('initialEvent') initialEvent;
  // Event types
  eventTypes = ["Event", "LocatedEvent", "MoveEvent", "WorkEvent"];
  eventType: string;
  interval: boolean = false;
  // Basic event
  name: string;
  description: string;
  beginDay: number;
  beginMonth: number;
  beginYear: number;

  endDay: number;
  endMonth: number;
  endYear: number;

  files: File[] = [];
  media: { type: string, path: string, postid: number }[] = [];
  // Located Event & Move Event
  location;

  // Work Event
  company: string;
  position: string;

  id: number;

  constructor(private httpService: HttpService, private router: Router) { }

  isLocated(): boolean {
    return this.eventTypes.indexOf(this.eventType) === 1 || this.eventTypes.indexOf(this.eventType) === 2 || this.eventTypes.indexOf(this.eventType) === 3;
  }

  ngOnInit() {
    this.eventType = "Event";
    this.location = {
      city: "",
      province: "",
      country: ""
    };
    if (this.initialEvent) {
      this.id = this.initialEvent.id;
      this.name = this.initialEvent.name;
      this.description = this.initialEvent.description;
      if (this.initialEvent.location) {
        this.location = this.initialEvent.location
      }
      if (this.initialEvent.type) {
        this.eventType = this.initialEvent.type
      }
      if (this.initialEvent.company) {
        this.company = this.initialEvent.company
        this.position = this.initialEvent.position
      }
      if (this.initialEvent.time) {
        let timeValues = this.initialEvent.time[0].split("-");
        this.beginDay = +timeValues[2]
        this.beginMonth = +timeValues[1]
        this.beginYear = +timeValues[0]
        if (this.initialEvent.time.length > 1) {
          timeValues = this.initialEvent.time[1].split("-");
          this.endDay = +timeValues[2]
          this.endMonth = +timeValues[1]
          this.endYear = +timeValues[0]
        }
      }
    }

  }

  fileChange(event) {
    let fileList: FileList = [].slice.call(event.target.files);
    if (fileList.length > 0) {
      for (var i = 0; i < fileList.length; i++) {
        this.files.push(fileList[i]);
      }
    }
  }

  commit() {
    if (this.valid()) {
      let eventObject;
      console.log(this.files);
      switch (this.eventType) {
        case "Event": { // Event
          let event = new EventComponent();
          this.initializeEvent(event);
          eventObject = this.addVisibilityToEvent(event.getAsObject());
          eventObject.files = this.files;
          eventObject.id = this.id;
          console.log("Emitting event:");
          console.log(eventObject)
          this.onSubmit.emit(eventObject);
          break;
        }
        case "LocatedEvent": { // LocatedEvent
          let event = new LocatedEventComponent();
          this.initializeEvent(event);
          event.location = new LocationComponent(this.location.city, this.location.province, this.location.country);
          eventObject = this.addVisibilityToEvent(event.getAsObject());
          eventObject.files = this.files;
          eventObject.id = this.id;
          console.log("Emitting locatedevent:");
          console.log(eventObject)
          this.onSubmit.emit(eventObject);
          break;
        }
        case "MoveEvent": { // MoveEvent
          let event = new MoveEventComponent();
          this.initializeEvent(event);
          event.location = new LocationComponent(this.location.city, this.location.province, this.location.country);
          eventObject = this.addVisibilityToEvent(event.getAsObject());
          eventObject.files = this.files;
          eventObject.id = this.id;
          console.log("Emitting moveevent:");
          console.log(eventObject)
          this.onSubmit.emit(eventObject);
          break;
        }
        case "WorkEvent": { // WorkEvent
          let event = new WorkEventComponent();
          this.initializeEvent(event);
          event.location = new LocationComponent(this.location.city, this.location.province, this.location.country);
          event.company = this.company;
          event.position = this.position;
          eventObject = this.addVisibilityToEvent(event.getAsObject());
          eventObject.files = this.files;
          eventObject.id = this.id;
          console.log("Emitting workevent:");
          console.log(eventObject)
          this.onSubmit.emit(eventObject);
          break;
        }
      }
    } else {
      console.log("invalid")
    }
  }




  valid(): boolean {
    return this.name !== "" && this.description !== "" && this.beginDay !== null && this.beginMonth !== null && this.beginYear !== null;
  }

  initializeEvent(event: EventComponent) {
    event.name = this.name;
    event.owner = this.owner;
    event.description = this.description;
    event.time = [this.beginYear + "-" + this.beginMonth + "-" + this.beginDay];
    if (this.endDay) {
      event.time.push(this.endYear + "-" + this.endMonth + "-" + this.endDay);
    }
  }

  removeFile(file: File) {
    var index = this.files.indexOf(file);
    this.files.splice(index, 1);
  }
  addVisibilityToEvent(eventAsObject) {
    eventAsObject.visibility = this.visibility;
    return eventAsObject;
  }
  visibility = { visibility: "public" }
  addVisibility($event) {
    console.log($event);
    this.visibility = $event;
  }
  delete() {
    this.onSubmit.emit('delete');
  }
}