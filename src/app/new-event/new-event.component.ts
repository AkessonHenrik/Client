import { Component, Output, Input, EventEmitter, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { LocationComponent } from '../location/location.component';
import { EventComponent, LocatedEventComponent, WorkEventComponent, MoveEventComponent } from '../event/event.component';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.component.html',
  styleUrls: ['./new-event.component.css']
})
export class NewEventComponent implements OnInit {

  @Output() onSubmit: EventEmitter<any> = new EventEmitter<any>();
  @Input() owner: number;
  // Event types
  eventTypes = ["Event", "Located Event", "Move Event", "Work Event"];
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

  constructor(private httpService: HttpService, private router: Router) { }

  isLocated(): boolean {
    return this.eventTypes.indexOf(this.eventType) === 1 || this.eventTypes.indexOf(this.eventType) === 2 || this.eventTypes.indexOf(this.eventType) === 3;
  }

  ngOnInit() {
    this.eventType = "";
    this.location = {
      city: "",
      province: "",
      country: ""
    };
  }

  fileChange(event) {
    let fileList: FileList = [].slice.call(event.target.files);
    if (fileList.length > 0) {
      for (var i = 0; i < fileList.length; i++) {
        this.files.push(fileList[i]);
      }
    }
  }

  create() {
    console.log(this.interval)
    if (this.valid()) {
      switch (this.eventType) {
        case "Event": { // Event
          let event = new EventComponent();
          this.initializeEvent(event);
          this.postEvent(event);
          break;
        }
        case "Located Event": { // LocatedEvent
          let event = new LocatedEventComponent();
          this.initializeEvent(event);
          event.location = new LocationComponent(this.location.city, this.location.province, this.location.country);
          this.postEvent(event);
          break;
        }
        case "Move Event": { // MoveEvent
          let event = new MoveEventComponent();
          this.initializeEvent(event);
          event.location = new LocationComponent(this.location.city, this.location.province, this.location.country);
          this.postEvent(event);
          break;
        }
        case "Work Event": { // WorkEvent
          let event = new WorkEventComponent();
          this.initializeEvent(event);
          event.location = new LocationComponent(this.location.city, this.location.province, this.location.country);
          event.company = this.company;
          event.position = this.position;
          this.postEvent(event);
          break;
        }
      }
    }
    this.onSubmit.emit();
  }

  postEvent(event: EventComponent): Promise<string> {
    return this.uploadMedia().then(response => {
    }).then(_ => {
      return this.media.forEach(media => {
        event.addMedia(media);
      })
    }).then(_ => {
      return this.httpService.addEvent(event.getAsObject());
    }).then(response => {
      event = null;
      return Promise.resolve("Hey");
    })
  }

  uploadMedia(): Promise<string> {
    return Promise.all(this.files.map(file => {
      console.log(file.name)
      return this.httpService.upload(file).then(response => {
        this.media.push({ type: response.type, path: response.path, postid: response.postid })
      })
    })
    ).then(_ => {
      return Promise.resolve("Media upload finished");
    })
  }

  valid(): boolean {
    return this.name !== "" && this.description !== "" && this.beginDay !== null && this.beginMonth !== null && this.beginYear !== null;
  }

  initializeEvent(event: EventComponent) {
    event.name = this.name;
    event.owner = this.owner;
    event.description = this.description;
    event.time = [this.beginDay + "-" + this.beginMonth + "-" + this.beginYear];
    if (this.endDay) {
      event.time.push(this.endDay + "-" + this.endMonth + "-" + this.endYear);
    }
  }

  removeFile(file: File) {
    var index = this.files.indexOf(file);
    this.files.splice(index, 1);
  }
}