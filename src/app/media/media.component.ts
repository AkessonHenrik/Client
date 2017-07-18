import { OnInit, Input, Component } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { LocationComponent } from '../location/location.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LocatedEventComponent, EventComponent, WorkEventComponent, MoveEventComponent } from '../event/event.component';
import { Node } from '../d3/models/node'
import * as globals from '../globals';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { HttpService } from '../http.service';
@Component({
    selector: 'media-component',
    template: ``
})
export class MediaComponent {
    @Input('source') source: string;
    constructor(public sanitizer: DomSanitizer) { }
    getUrl(): SafeResourceUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.source);
    }
}

@Component({
    selector: 'image-component',
    template: `<img style="margin: 2px!important" [src]="getUrl()" width="auto" height="300">`
})
export class ImageComponent extends MediaComponent {
    @Input('source') source;
}

@Component({
    selector: 'external-video-component',
    template: `<iframe width="534" height="300" [src]="getUrl()" style="border: none;"></iframe>`
})
export class ExternalVideoComponent extends MediaComponent {
    @Input('source') source;
}

@Component({
    selector: 'audio-component',
    template: `<audio controls width="534" height="300" [src]="getUrl()" style="border: none;"></audio>`
})
export class AudioComponent extends MediaComponent {
    @Input('source') source;
}
@Component({
  selector: 'video-component',
  template: `<video width="auto" height="300" controls type="video/mp4" [src]="getUrl()"></video>`
})
export class VideoComponent extends MediaComponent {
  @Input('source') source;
}