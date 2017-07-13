import { OnChanges, OnInit, Component, Inject, NgZone, Input, Output, EventEmitter, ChangeDetectorRef, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Node, Relationship } from '../../d3'
import * as globals from '../../globals';
import { NewEventComponent } from '../../new-event/new-event.component'
import { LocatedEventComponent, EventComponent } from '../../event/event.component';
import { LocationComponent } from '../../location/location.component';
@Component({
  selector: 'relationshipdialog',
  templateUrl: './relationshipdialog.html',
  styleUrls: ['./persondialog.css', './relationshipdialog.css']
})
export class NewRelationshipDialog implements OnInit {
  from: string;
  to: string;
  relationshipType: string;
  activeTab: number = 0;

  beginDay: number;
  beginMonth: number;
  beginYear: number;

  endDay: number;
  endMonth: number;
  endYear: number;
  location;
  relationshipTypes: string[];

  files: File[] = [];
  interval: boolean = false;
  isLocated: boolean = false;
  associateEvent: boolean = false;

  nodes: Node[];


  description: string;
  media: { type: string, path: string }[] = [];
  constructor( @Inject(MD_DIALOG_DATA) private data: Node[], public dialogRef: MdDialogRef<NewRelationshipDialog>) {
    this.relationshipTypes = globals.relationshipTypes;
  }
  createRelationshipWithEvent() {
    let returnRel = this.createRelationship();
    let time = [this.beginDay + "-" + this.beginMonth + "-" + this.beginYear];
    if (this.interval) {
      time.push(this.endDay + "-" + this.endMonth + "-" + this.endYear);
    }
    if (this.isLocated === true) {
      returnRel.event = new LocatedEventComponent();
      returnRel.event.initialize({
        name: "Relationship between " + returnRel.source.firstname + " and " + returnRel.target.firstname,
        description: this.description,
        time: time,
        media: this.media,
        owner: returnRel.id,
        location: new LocationComponent(this.location.city, this.location.province, this.location.country)
      })
    } else {
      returnRel.event = new EventComponent();
      returnRel.event.initialize({
        name: "Relationship between " + returnRel.source.firstname + " and " + returnRel.target.firstname,
        description: this.description,
        time: time,
        media: this.media,
        owner: returnRel.id,
      })
    }
    this.dialogRef.close(returnRel)

  }
  createRelationshipOnly() {
    this.dialogRef.close(this.createRelationship());
  }
  createRelationship() {
    let fromNode: Node = this.nodes.filter(node => node.firstname === this.from)[0]
    let toNode: Node = this.nodes.filter(node => node.firstname === this.to)[0]
    let returnRel = new Relationship(100, fromNode, toNode, globals.relationshipTypes.indexOf(this.relationshipType));
    let end = (this.endDay ? this.endDay + "-" + this.endMonth + "-" + this.endYear : null);
    returnRel.time = {
      begin: this.beginDay + "-" + this.beginMonth + "-" + this.beginYear
    }
    if (end) {
      returnRel.time.end = end;
    }
    return returnRel;
  }
  public ngOnInit() {
    console.log(this.associateEvent);
    //set custom data from parent component
    this.nodes = this.data;
    this.location = this.location = {
      city: "",
      province: "",
      country: ""
    };
  }
  next() {
    this.activeTab = 1;
  }

  fileChange(event) {
    let fileList: FileList = [].slice.call(event.target.files);
    if (fileList.length > 0) {
      for (var i = 0; i < fileList.length; i++) {
        this.files.push(fileList[i]);
      }
    }
  }
}