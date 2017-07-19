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
  died: any = null;
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
          this.born = this.parseEvent(body.born)
          this.events.push(this.born);
          if (body.died) {
            this.died = this.parseEvent(body.died);
            this.events.push(this.died);
          }
          body.events.forEach(event => this.events.push(this.parseEvent(event)))
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


  parseEvent(event): EventComponent {
    console.log("Parsinggu: " + event.name)
    let newEvent;
    if (event.type === "WorkEvent") {
      console.log("WorkEvent")
      newEvent = new WorkEventComponent();
      newEvent.id = event.id;
      newEvent.name = event.name;
      newEvent.description = event.description;
      newEvent.company = event.company;
      newEvent.position = event.position;
      newEvent.location = new LocationComponent(event.location.city, event.location.province, event.location.country);
      newEvent.time = event.time;
    } else if (event.type === "LocatedEvent") {
      console.log("LocatedEvent")
      newEvent = new LocatedEventComponent();
      newEvent.id = event.id;
      newEvent.name = event.name;
      newEvent.description = event.description;
      newEvent.time = event.time;
      newEvent.location = new LocationComponent(event.location.city, event.location.province, event.location.country);
    } else if (event.type === "MoveEvent") {
      console.log("MoveEvent")
      newEvent = new MoveEventComponent();
      newEvent.id = event.id;
      newEvent.name = event.name;
      newEvent.description = event.description;
      newEvent.time = event.time;
      newEvent.location = new LocationComponent(event.location.city, event.location.province, event.location.country);
    } else {
      newEvent = new EventComponent();
      newEvent.id = event.id;
      newEvent.name = event.name;
      newEvent.description = event.description;
      newEvent.time = event.time;
    }
    newEvent.media = [];
    event.media.forEach(media => {
      newEvent.media.push({ type: media.type, path: globals.fileEndpoint + media.path, postid: media.postid })
    })
    return newEvent;
  }
}