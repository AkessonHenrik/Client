import { ViewChild, ElementRef, OnInit, Input, Component } from '@angular/core';
import { Http, Request } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { LocationComponent } from '../location/location.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LocatedEventComponent, EventComponent, WorkEventComponent, MoveEventComponent } from '../event/event.component';
import { Node } from '../d3/models/node'
import * as globals from '../globals';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent implements OnInit {
  @Input('profileId') id: number;
  firstname: string;
  lastname: string;
  profile: any;
  profilePicture: string;
  born: any;
  died: any;
  events: EventComponent[] = []
  profileReady: boolean = false;
  ngOnInit() {
    if (this.id > 0) {
      this.httpService.getProfile(this.id)
        .then(res => {
          let body = res.json();
          console.log(body);
          this.firstname = body.profile.firstname
          this.lastname = body.profile.lastname
          this.profile = body.profile;
          this.profilePicture = body.profile.image
          let born = body.born;
          if (born.type === "WorkEvent") {
            this.born = new WorkEventComponent();
            this.born.name = born.name;
            this.born.id = born.id;
            this.born.description = born.description;
            this.born.company = born.company;
            this.born.position = born.position;
            this.born.location = new LocationComponent(born.location.city, born.location.province, born.location.country);
            this.born.time = born.time;
          } else if (born.type === "LocatedEvent") {
            this.born = new LocatedEventComponent();
            this.born.name = born.name;
            this.born.id = born.id;
            this.born.description = born.description;
            this.born.time = born.time;
            this.born.location = new LocationComponent(born.location.city, born.location.province, born.location.country);
          } else if (born.type === "MoveEvent") {
            this.born = new MoveEventComponent();
            this.born.name = born.name;
            this.born.id = born.id;
            this.born.description = born.description;
            this.born.time = born.time;
            this.born.location = new LocationComponent(born.location.city, born.location.province, born.location.country);
          } else {
            this.born = new EventComponent();
            this.born.name = born.name;
            this.born.id = born.id;
            this.born.description = born.description;
            this.born.time = born.time;
          }
          this.born.media = [];
          born.media.forEach(media => {
            this.born.media.push({ type: media.type, path: globals.fileEndpoint + media.path, postid: media.postid })
          })
          this.events.push(this.born);
          if (body.died !== null) {
            let died = body.died;
            if (died.type === "WorkEvent") {
              this.died = new WorkEventComponent();
              this.died.name = died.name;
              this.died.id = died.id;
              this.died.description = died.description;
              this.died.company = died.company;
              this.died.position = died.position;
              this.died.location = new LocationComponent(died.location.city, died.location.province, died.location.country);
              this.died.time = died.time;
            } else if (died.type === "LocatedEvent") {
              this.died = new LocatedEventComponent();
              this.died.name = died.name;
              this.died.id = died.id;
              this.died.description = died.description;
              this.died.time = died.time;
              this.died.location = new LocationComponent(died.location.city, died.location.province, died.location.country);
            } else if (died.type === "MoveEvent") {
              this.died = new MoveEventComponent();
              this.died.name = died.name;
              this.died.id = died.id;
              this.died.description = died.description;
              this.died.time = died.time;
              this.died.location = new LocationComponent(died.location.city, died.location.province, died.location.country);
            } else {
              this.died = new EventComponent();
              this.died.name = died.name;
              this.died.id = died.id;
              this.died.description = died.description;
              this.died.time = died.time;
            }
            this.died.media = [];
            died.media.forEach(media => {
              this.died.media.push({ type: media.type, path: globals.fileEndpoint + media.path, postid: media.postid })
            })
            this.events.push(this.died);
          }
          body.events.forEach(event => {
            let newEvent;
            if (event.type === "WorkEvent") {
              newEvent = new WorkEventComponent();
              newEvent.id = event.id;
              newEvent.name = event.name;
              newEvent.description = event.description;
              newEvent.company = event.company;
              newEvent.position = event.position;
              newEvent.location = new LocationComponent(event.location.city, event.location.province, event.location.country);
              newEvent.time = event.time;
              this.events.push(newEvent);
            } else if (event.type === "LocatedEvent") {
              newEvent = new LocatedEventComponent();
              newEvent.id = event.id;
              newEvent.name = event.name;
              newEvent.description = event.description;
              newEvent.time = event.time;
              newEvent.location = new LocationComponent(event.location.city, event.location.province, event.location.country);
              this.events.push(newEvent)
            } else if (event.type === "MoveEvent") {
              newEvent = new MoveEventComponent();
              newEvent.id = event.id;
              newEvent.name = event.name;
              newEvent.description = event.description;
              newEvent.time = event.time;
              newEvent.location = new LocationComponent(event.location.city, event.location.province, event.location.country);
              this.events.push(newEvent);
            } else {
              newEvent = new EventComponent();
              newEvent.id = event.id;
              newEvent.name = event.name;
              newEvent.description = event.description;
              newEvent.time = event.time;
              this.events.push(newEvent);
            }
            newEvent.media = [];
            event.media.forEach(media => {
              newEvent.media.push({ type: media.type, path: globals.fileEndpoint + media.path, postid: media.postid })
            })
          })
          // Sort events chronologically
          this.events.sort(function (event1, event2) {
            return event1.time[0] > event2.time[0] ? -1 : event1.time[0] < event2.time[0] ? 1 : 0;
          })
          console.log(this.dialog)
          this.profileReady = true;
        })
    }
  }
  constructor(private httpService: HttpService, public dialog: MdDialog) { }
}