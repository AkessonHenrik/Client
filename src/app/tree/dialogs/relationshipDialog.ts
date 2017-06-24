import { OnChanges, OnInit, Component, Inject, NgZone, Input, Output, EventEmitter, ChangeDetectorRef, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Node, Relationship } from '../../d3'

@Component({
  selector: 'relationshipdialog',
  templateUrl: './relationshipdialog.html',
  styleUrls: ['./persondialog.css']
})
export class NewRelationshipDialog implements OnInit {
  from: string;
  to: string;
  relationshipType: string;
  relationshipTypes: string[] = ["Partner", "Spouse", "Other", "Cousin"]
  
  beginDay: number;
  beginMonth: number;
  beginYear: number;

  endDay: number;
  endMonth: number;
  endYear: number;

  nodes: Node[];
  constructor( @Inject(MD_DIALOG_DATA) private data: Node[], public dialogRef: MdDialogRef<NewRelationshipDialog>) {
  }
  createRelationship() {
    // const n: Node = new Node(100, undefined, this.firstname, this.lastname);
    // console.log(n)
    console.log(this.relationshipType)
    let fromNode: Node = this.nodes.filter(node => node.firstname === this.from)[0]
    let toNode: Node = this.nodes.filter(node => node.firstname === this.to)[0]
    let returnRel = new Relationship(100, fromNode, toNode, this.relationshipType);
    let end = (this.endDay ? this.endDay + "-" + this.endMonth + "-" + this.endYear : null);
    returnRel.time = {
      begin: this.beginDay + "-" + this.beginMonth + "-" + this.beginYear
    }
    if(end) {
      returnRel.time.end = end;
    }
    this.dialogRef.close(returnRel);
  }
  public ngOnInit() {
    //set custom data from parent component
    console.log("OnInit")
    console.log(this.data);
    this.nodes = this.data;
  }
}