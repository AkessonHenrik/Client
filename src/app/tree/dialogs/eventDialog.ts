import { OnChanges, OnInit, Component, Inject, NgZone, Input, Output, EventEmitter, ChangeDetectorRef, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { WorkEventComponent, MoveEventComponent, EventComponent, LocatedEventComponent } from '../../event/event.component';
import { HttpService } from '../../http-service.service';
import { LocationComponent } from '../../location/location.component';
import * as globals from '../../globals';
@Component({
    selector: 'event-dialog',
    templateUrl: './eventDialog.html',
    styleUrls: ['./persondialog.css']
})
export class EventDialog implements OnInit {
    constructor( @Inject(MD_DIALOG_DATA) private data: number, public dialogRef: MdDialogRef<EventDialog>, private httpService: HttpService) {
    }
    error: string = "";
    event;
    ngOnInit() {
        this.httpService.getEvent(this.data).then(response => {
            if (response === 404) {
                this.error = "No event is associated to this relationship"
            } else {
                event = response.json();
                if (event.type === "WorkEvent") {
                    this.event = new WorkEventComponent();
                    this.event.name = event["name"];
                    this.event.description = event["description"];
                    this.event.company = event["company"];
                    this.event.position = event["position"];
                    this.event.location = new LocationComponent(event["location"].city, event["location"].province, event["location"].country);
                    this.event.time = event["time"];
                } else if (event.type === "LocatedEvent") {
                    this.event = new LocatedEventComponent();
                    this.event.name = event["name"];
                    this.event.description = event["description"];
                    this.event.time = event["time"];
                    this.event.location = new LocationComponent(event["location"].city, event["location"].province, event["location"].country);
                } else if (event.type === "MoveEvent") {
                    this.event = new MoveEventComponent();
                    this.event.name = event["name"];
                    this.event.description = event["description"];
                    this.event.time = event["time"];
                    this.event.location = new LocationComponent(event["location"].city, event["location"].province, event["location"].country);;
                } else {
                    this.event = new EventComponent();
                    this.event.name = event["name"];
                    this.event.description = event["description"];
                    this.event.time = event["time"];;
                }
                this.event.media = [];
                event["media"].forEach(media => {
                    this.event.media.push({ type: media.type, path: globals.fileEndpoint + media.path })
                })
            }
        })
    }
}