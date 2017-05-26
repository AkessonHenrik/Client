import { OnChanges, OnInit, Component, Inject, NgZone, Input, Output, EventEmitter, ChangeDetectorRef, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { Node, Link, Relationship } from '../../d3';
import { MdButtonModule } from '@angular/material';
import { MdIconModule } from '@angular/material';
import { MdIconRegistry } from '@angular/material';
import { TreeComponent } from '../../tree/tree.component';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { MdInputModule } from '@angular/material';
import { ParentComponent } from '../../parent/parent.component';
import { SimpleChanges } from '@angular/core';
import { MdSelectModule } from '@angular/material';


@Component({
  selector: 'graph',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnChanges {
  @Input('tree') _tree: TreeComponent;
  // @Input('nodes')
  _nodes: Node[];
  @Input('links') _links: Link[];
  @Input('parents') parents: ParentComponent[]

  @Input('nodes')
  set nodes(nodes: Node[]) {
    this._nodes = nodes;
  }

  @Output()
  outputNodeEvent: EventEmitter<Node> = new EventEmitter();
  @Output()
  outputRelEvent: EventEmitter<Relationship> = new EventEmitter();

  get tree() {
    return this._tree;
  }
  get nodes() {
    return this._nodes;
  }
  get links() {
    return this._links
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("GraphComponent")
    console.log(changes)
  }
  height: number = 720;
  width: number = 1280;
  selectedOption: string;
  constructor(private zone: NgZone, public dialog: MdDialog) {
  }
  openDialog() {
    let dialogRef = this.dialog.open(ChoiceDialog);
    dialogRef.afterClosed().subscribe(result => {
      switch (result) {
        case "node": {
          console.log("Chose new person");
          console.log(result)
          this.newNode();
          break;
        }
        case "relationship": {
          console.log("Chose new relationship");
          this.newRelationship();
          break;
        }
      }
    });
  }
  newNode() {
    let dialogRef = this.dialog.open(NewPersonDialog);
    dialogRef.afterClosed().subscribe(node => {
      // this.tree.addNode(node);
      // this._nodes = this.tree.nodes
      this.outputNodeEvent.emit(node);
    });
  }
  newRelationship() {
    let dialogRef = this.dialog.open(NewRelationshipDialog, {
      data: this._nodes
    });
    dialogRef.afterClosed().subscribe(relationship => {
      // this.tree.addRelationship(relationship);
      this.outputRelEvent.emit(relationship)
    });
  }
  newParents() {
    let dialogRef = this.dialog.open(NewParentDialog, {
      data: {
        nodes: this._nodes,
        links: this._links
      }
    })
  }
}

@Component({
  selector: 'dialogchoice',
  templateUrl: './dialogchoice.html',
  styleUrls: ['./dialogchoice.css']
})
export class ChoiceDialog {
  constructor(public dialogRef: MdDialogRef<ChoiceDialog>) {
  }
}


@Component({
  selector: 'persondialog',
  templateUrl: './persondialog.html',
  styleUrls: ['./persondialog.css']
})
export class NewPersonDialog {
  firstname: string;
  lastname: string;
  image: string;
  constructor(public dialogRef: MdDialogRef<ChoiceDialog>) {
  }
  createPerson() {
    const n: Node = new Node(100, undefined, this.firstname, this.lastname);
    console.log(n)
    this.dialogRef.close(n);
  }
}


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
  constructor( @Inject(MD_DIALOG_DATA) private data: Node[], public dialogRef: MdDialogRef<ChoiceDialog>) {
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

@Component({
  selector: 'parentdialog',
  templateUrl: './parentdialog.html',
  styleUrls: ['./persondialog.css']
})
export class NewParentDialog implements OnInit {
  parent: string;
  child: string;
  parentType: string;
  nodes: Node[];
  constructor( @Inject(MD_DIALOG_DATA) private data: { nodes: Node[], links: Link[] }, public dialogRef: MdDialogRef<NewParentDialog>) { }
  public ngOnInit() {

  }
}