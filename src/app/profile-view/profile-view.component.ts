import { ViewChild, ElementRef, OnInit, Input, Component } from '@angular/core';
import { Http, Request } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { LocationComponent } from '../location/location.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LocatedEventComponent, EventComponent, WorkEventComponent, MoveEventComponent } from '../event/event.component';
import { Node } from '../d3/models/node'
import * as globals from '../globals';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

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
      this.http.get("http://localhost:9000/profile/" + this.id)
        .toPromise()
        .then(res => {
          let body = res.json();
          console.log(body);
          this.firstname = body.profile.firstname
          this.lastname = body.profile.lastname
          this.profile = body.profile;
          this.profilePicture = body.profile.image
          let born = body.born;
          this.born = body.born;
          this.died = body.died;
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
  constructor(private http: Http, public dialog: MdDialog) { }
}


@Component({
  selector: 'media-component',
  template: ``,
  styleUrls: ['./profile-view.component.css']
})
export class MediaComponent {
  @Input('source') source: string;
  constructor(public sanitizer: DomSanitizer) { }
  getUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.source);
  }
}

@Component({
  selector: 'video-component',
  template: `<video width="auto" height="300" controls type="video/mp4" [src]="getUrl()"></video>`,
  styleUrls: ['./profile-view.component.css']
})
export class VideoComponent extends MediaComponent {
  @Input('source') source;
}

@Component({
  selector: 'image-component',
  template: `<img style="margin: 2px!important" [src]="getUrl()" width="auto" height="300">`,
  styleUrls: ['./profile-view.component.css']
})
export class ImageComponent extends MediaComponent {
  @Input('source') source;
}

@Component({
  selector: 'external-video-component',
  template: `<iframe width="534" height="300" [src]="getUrl()" style="border: none;"></iframe>`,
  styleUrls: ['./profile-view.component.css']
})
export class ExternalVideoComponent extends MediaComponent {
  @Input('source') source;
}

@Component({
  selector: 'audio-component',
  template: `<audio controls width="534" height="300" [src]="getUrl()" style="border: none;"></audio>`,
  styleUrls: ['./profile-view.component.css']
})
export class AudioComponent extends MediaComponent {
  @Input('source') source;
}