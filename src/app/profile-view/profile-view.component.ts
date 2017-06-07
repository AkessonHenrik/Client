import { Input, Component } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { LocationComponent } from '../location/location.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EventComponent, WorkEventComponent, LifeEventComponent } from '../event/event.component';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent {
  @Input('profileId') id;
  firstName: string;
  lastName: string;
  profilePicture: string;
  life: LifeEventComponent;
  events: EventComponent[] = []
  constructor(private http: Http) {
    this.http.get('assets/JonSnow.json')
      .toPromise()
      .then(res => {
        let body = res.json();
        this.firstName = body.firstName
        this.lastName = body.lastName
        this.profilePicture = body.profilePicture
        
        this.life = body.life;
        body.events.forEach(event => {
          let newEvent;
          if (event.type === "WorkEvent") {
            newEvent = new WorkEventComponent();
            newEvent.company = event.Company;
            newEvent.position = event.position;
            newEvent.location = new LocationComponent(event.location.city, event.location.province, event.location.country);
            newEvent.name = event.name;
            newEvent.description = event.description;
            newEvent.time = event.time;
            this.events.push(newEvent);
          }
          newEvent.media = [];
          event.media.forEach(media => {
            newEvent.media.push({ type: media.type, path: media.path })
          })
        })
      })
  }
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