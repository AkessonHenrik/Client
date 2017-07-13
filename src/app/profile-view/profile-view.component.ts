import { OnInit, Input, Component } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { LocationComponent } from '../location/location.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LocatedEventComponent, EventComponent, WorkEventComponent, MoveEventComponent } from '../event/event.component';
import { Node } from '../d3/models/node'
import * as globals from '../globals';
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

          this.born = body.born;
          this.died = body.died;
          body.events.forEach(event => {
            let newEvent;
            if (event.type === "WorkEvent") {
              newEvent = new WorkEventComponent();
              newEvent.name = event.name;
              newEvent.description = event.description;
              newEvent.company = event.company;
              newEvent.position = event.position;
              newEvent.location = new LocationComponent(event.location.city, event.location.province, event.location.country);
              newEvent.time = event.time;
              this.events.push(newEvent);
            } else if (event.type === "LocatedEvent") {
              newEvent = new LocatedEventComponent();
              newEvent.name = event.name;
              newEvent.description = event.description;
              newEvent.time = event.time;
              newEvent.location = new LocationComponent(event.location.city, event.location.province, event.location.country);
              this.events.push(newEvent)
            } else if (event.type === "MoveEvent") {
              newEvent = new MoveEventComponent();
              newEvent.name = event.name;
              newEvent.description = event.description;
              newEvent.time = event.time;
              newEvent.location = new LocationComponent(event.location.city, event.location.province, event.location.country);
              this.events.push(newEvent);
            } else {
              newEvent = new EventComponent();
              newEvent.name = event.name;
              newEvent.description = event.description;
              newEvent.time = event.time;
              this.events.push(newEvent);
            }
            newEvent.media = [];
            event.media.forEach(media => {
              newEvent.media.push({ type: media.type, path: globals.fileEndpoint + media.path })
            })
          })
          // Sort events chronologically
          this.events.sort(function (event1, event2) {
            return event1.time[0] > event2.time[0] ? -1 : event1.time[0] < event2.time[0] ? 1 : 0;
          })
          this.profileReady = true;
        })
    }
  }
  constructor(private http: Http) { }
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
  template: `<video width="auto" height="300" controls><source [src]="getUrl()"></video>`,
  styleUrls: ['./profile-view.component.css']
})
export class VideoComponent extends MediaComponent {
  @Input('source') source;
  getUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.source);
  }
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