import { OnChanges, OnInit, Component, Inject, NgZone, Input, Output, EventEmitter, ChangeDetectorRef, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { WorkEventComponent, MoveEventComponent, EventComponent, LocatedEventComponent } from '../../event/event.component';
import { HttpService } from '../../http.service';
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

    comments: { commenter: string, content: string, date: string }[] = [];
    comment: string;
    ngOnInit() {
        console.log("Hey dialog got " + this.data)
        this.httpService.getEvent(this.data).then(response => {
            if (response === 404) {
                this.error = "No event is associated to this relationship"
                return Promise.resolve("No event");
            } else {
                event = response.json();
                console.log(event);
                if (event.type === "WorkEvent") {
                    this.event = new WorkEventComponent();
                    this.initializeEvent(event);
                    this.event.company = event["company"];
                    this.event.position = event["position"];
                    this.event.location = new LocationComponent(event["location"].city, event["location"].province, event["location"].country);
                } else if (event.type === "LocatedEvent") {
                    this.event = new LocatedEventComponent();
                    this.initializeEvent(event);
                    this.event.location = new LocationComponent(event["location"].city, event["location"].province, event["location"].country);
                } else if (event.type === "MoveEvent") {
                    this.event = new MoveEventComponent();
                    this.initializeEvent(event);
                    this.event.location = new LocationComponent(event["location"].city, event["location"].province, event["location"].country);;
                } else {
                    this.event = new EventComponent();
                    this.initializeEvent(event);
                }
                this.event.media = [];
                event["media"].forEach(media => {
                    console.log("media:");
                    console.log(media);
                    this.event.media.push({ type: media.type, path: globals.fileEndpoint + media.path, postid: media.postid })
                })
                return Promise.resolve("Event fetching finished")
            }
        }).then(result => {
            if (result === "No event") {
                console.log("Don't get comments");
            } else {
                console.log("Get comments")
                this.httpService.getComments(this.event.id).then(response => {
                    console.log(response);
                    response.forEach(comment => {
                        this.comments.push(comment);
                    })
                    this.reorderComments();
                })
            }
        })
    }
    reorderComments() {
        // Sort comments chronologically
        this.comments.sort(function (comment1, comment2) {
            return comment1.date < comment2.date ? -1 : comment1.date > comment2.date ? 1 : 0;
        })
    }
    initializeEvent(event) {
        this.event.name = event["name"];
        this.event.id = event["id"];
        this.event.description = event["description"];
        this.event.time = event["time"];
    }

    submitComment() {
        if (this.comment.length > 0) {
            this.httpService.postComment({
                postid: this.event.id,
                content: this.comment,
                commenterid: globals.getUserId()
            }).then(response => {
                console.log(response);
                if (response.status === 200) {
                    let body = response.json()
                    this.comments.push({ commenter: body.commenter, content: body.content, date: body.date })
                    this.reorderComments();
                    this.comment = "";
                }
            })
        }
    }
}