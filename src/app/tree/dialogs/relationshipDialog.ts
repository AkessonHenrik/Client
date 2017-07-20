import { OnChanges, OnInit, Component, Inject, NgZone, Input, Output, EventEmitter, ChangeDetectorRef, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Node, Relationship } from '../../d3'
import * as globals from '../../globals';
import { NewEventComponent } from '../../new-event/new-event.component'
import { LocatedEventComponent, EventComponent } from '../../event/event.component';
import { LocationComponent } from '../../location/location.component';
import { HttpService } from '../../http.service';
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
  addDetails: boolean = false;

  nodes: Node[];


  description: string;
  media: { type: string, path: string, postid: number }[] = [];
  constructor( @Inject(MD_DIALOG_DATA) private data: Node[], public dialogRef: MdDialogRef<NewRelationshipDialog>, private httpService: HttpService) {
    this.relationshipTypes = globals.relationshipTypes;
  }
  createRelationshipWithDetails() {
    let returnRel = this.createRelationship();
    let time = [this.beginYear + "-" + this.beginMonth + "-" + this.beginDay];
    if (this.interval) {
      time.push(this.endYear + "-" + this.endMonth + "-" + this.endDay);
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
    this.uploadMedia().then(response => {
      return this.media.forEach(media => {
        returnRel.event.addMedia(media);
      })
    }).then(response => {
      this.dialogRef.close(returnRel)
    })

  }
  uploadMedia(): Promise<string> {
    return Promise.all(this.files.map(file => {
      return this.httpService.upload(file).then(response => {
        this.media.push({ type: response.type, path: response.path, postid: response.postid })
      })
    })
    ).then(_ => {
      return Promise.resolve("Media upload finished");
    })
  }
  createRelationshipWithoutDetails() {
    this.dialogRef.close(this.createRelationship());
  }
  createRelationship() {
    let fromNode: Node = this.nodes.filter(node => node.firstname === this.from)[0]
    let toNode: Node = this.nodes.filter(node => node.firstname === this.to)[0]
    let returnRel = new Relationship(-3, fromNode, toNode, globals.relationshipTypes.indexOf(this.relationshipType));
    let end = (this.endDay ? this.endYear + "-" + this.endMonth + "-" + this.endDay : null);
    returnRel.time = {
      begin: this.beginYear + "-" + this.beginMonth + "-" + this.beginDay
    }
    if (end) {
      returnRel.time.end = end;
    }
    returnRel.event = new EventComponent();
    returnRel.event.initialize({
      name: "Relationship between " + returnRel.source.firstname + " and " + returnRel.target.firstname,
      description: "Became " + this.relationshipType,
      time: [returnRel.time.begin],
      media: this.media,
      owner: returnRel.id,
    })
    return returnRel;
  }
  public ngOnInit() {
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
        console.log(fileList[i].name);
      }
    }
  }
}