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
  nodes: Node[];
  constructor( @Inject(MD_DIALOG_DATA) private data: Node[], public dialogRef: MdDialogRef<NewRelationshipDialog>) {
  }
  createRelationship() {
    // const n: Node = new Node(100, undefined, this.firstname, this.lastname);
    // console.log(n)
    console.log(this.relationshipType)
    let fromNode: Node = this.nodes.filter(node => node.firstname === this.from)[0]
    let toNode: Node = this.nodes.filter(node => node.firstname === this.to)[0]
    this.dialogRef.close(new Relationship(100, fromNode, toNode, this.relationshipType));
  }
  public ngOnInit() {
    //set custom data from parent component
    console.log("OnInit")
    console.log(this.data);
    this.nodes = this.data;
  }
}