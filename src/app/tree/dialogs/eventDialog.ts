import { OnChanges, OnInit, Component, Inject, NgZone, Input, Output, EventEmitter, ChangeDetectorRef, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { WorkEventComponent, MoveEventComponent, EventComponent, LocatedEventComponent } from '../../event/event.component';
import { HttpService } from '../../http.service';
import { LocationComponent } from '../../location/location.component';
import * as globals from '../../globals';
import { EditEventComponent } from '../../edit-event/edit-event.component';
import { EditRelationshipComponent } from '../../edit-relationship/edit-relationship.component';
import { NewRelationshipDialog } from './relationshipDialog'
import { NewParentDialog } from './parentDialog'
import { NewEventComponent } from '../../new-event/new-event.component';
import { NewEventDialogComponent } from '../../new-event-dialog/new-event-dialog.component';
@Component({
    selector: 'event-dialog',
    templateUrl: './eventDialog.html',
    styleUrls: ['./persondialog.css']
})
export class EventDialog implements OnInit {
    constructor( @Inject(MD_DIALOG_DATA) private data: { id: number, relationship: boolean, parent: boolean }, public dialogRef: MdDialogRef<EventDialog>, private httpService: HttpService, protected dialog: MdDialog) {
    }
    error: string = "";
    event;

    comments: { commenter: string, content: string, date: string }[] = [];
    comment: string;
    ngOnInit() {
        this.httpService.getEvent(this.data.id).then(response => {
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
                    this.event.media.push({ type: media.type, path: media.path, postid: media.postid })
                })
                console.log("=================")
                console.log(this.event);
                console.log("=================")
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
        }).then(_ => {
            this.getIsOwned();
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
    isOwned: boolean;
    getIsOwned() {
        this.httpService.isOwned(globals.getUserId(), this.event.id).then(response => {
            this.isOwned = response;
        });
    }

    edit() {
        if (this.data.relationship === true) { // Edit relationship
            let dialogRef = this.dialog.open(NewRelationshipDialog, {
                data: { nodes: [], edit: true, event: this.event }
            });
            dialogRef.afterClosed().subscribe(updatedRelationship => {
                // If relationship was deleted, nothing is sent back
                if (updatedRelationship) {
                    this.httpService.updateRelationship(updatedRelationship).then(_ => {
                        this.dialogRef.close();
                    })
                }
            });
        } else if (this.data.parent === true) { // Edit Parent
            let dialogRef = this.dialog.open(NewParentDialog, {
                data: { edit: true, event: this.event }
            });
            dialogRef.afterClosed().subscribe(updatedParent => {
                // If relationship was deleted, nothing is sent back
                if (updatedParent) {
                    this.httpService.updateParent(updatedParent).then(_ => {
                        this.dialogRef.close();
                    })
                }
            });
        } else { // Edit event
            console.log("Event way up");
            console.log(this.event)
            let dialogRef = this.dialog.open(NewEventDialogComponent, { data: { edit: true, event: this.event } });
            dialogRef.afterClosed().subscribe(updatedEvent => {
                if (updatedEvent === 'delete') {
                    this.httpService.delete(this.event.id);
                    this.dialogRef.close();
                } else if (updatedEvent) {
                    console.log(updatedEvent)
                    this.httpService.updateEvent(updatedEvent).then(_ => {
                        this.dialogRef.close();
                    })
                }
            })
        }
    }
}