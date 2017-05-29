import { OnChanges, OnInit, Component, Inject, NgZone, Input, Output, EventEmitter, ChangeDetectorRef, HostListener, ChangeDetectionStrategy } from '@angular/core';
import APP_CONFIG from '../app.config';
import { Node, Link, Relationship } from '../d3';
import { ParentComponent, NodeParentComponent, LinkParentComponent } from '../parent/parent.component';
import { GraphComponent } from '../visuals/graph/graph.component';
import { Http } from '@angular/http';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { MdInputModule } from '@angular/material';
import { SimpleChanges } from '@angular/core';
import { MdSelectModule, MdMenuModule } from '@angular/material';
import { TreeDataService } from '../tree-data.service';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnInit/*implements OnChanges*/ {
  nodes: Node[] = [];
  links: Link[] = [];
  parents: ParentComponent[] = [];
  ready: boolean = false;
  height: number = 720;
  width: number = 1280;
  get _nodes() {
    return this.nodes;
  }

  handleStuff(node: Node) {
    console.log("Tree: " + node.firstname);
    let data = this.dataService.getData(node.id).then(data => {
      console.log("DATA")
      console.log(data);
      this.createData(data.nodes, data.links, data.parents);
    })
  }

  newContent: boolean = false;

  logger: boolean = false;
  savingContent: boolean = false;

  constructor(private http: Http, private zone: NgZone, public dialog: MdDialog, private dataService: TreeDataService) {

  }
  ngOnInit() {
    let data = this.dataService.getData(+localStorage["current_id"]).then(data => {
      console.log("DATA")
      console.log(data);
      this.createData(data.nodes, data.links, data.parents);
    })
  }
  createData(
    jsonNodes: [{ id: number, firstName: string, lastName: string, image: string }],
    jsonRelationships: [{ id: number, from: number, to: number, relationshipType: string }],
    jsonParents: [{ id: number, parent: number, child: number, parentType: string, biological: boolean }]) {
    // Interpret and create NodeComponents
    console.log("JSONNODES")
    jsonNodes.forEach(node => {
      console.log(node.firstName)
      let contained: boolean = false;
      this.nodes.forEach(n => {
        if (n.id === node.id) {
          contained = true;
        }
      })
      if (!contained) {
        const n: Node = new Node(node.id, node.image, node.firstName, node.lastName);
        console.log("Adding " + n.firstname)
        this.nodes.push(n);
      }
    });

    // Interpret and create relationships (Link)
    jsonRelationships.forEach(link => {
      let contained: boolean = false;
      this.links.forEach(l => {
        if (l.id === link.id) {
          console.log("We already have")
          console.log(l);
          contained = true;
        }
      })
      if (!contained) {
        let from: Node = this.nodes.filter(node => node.id === link.from)[0];
        let to: Node = this.nodes.filter(node => node.id === link.to)[0];
        console.log("link not contained between " + from.firstname + " and " + to.firstname);
        const l: Relationship = new Relationship(link.id, from, to, link.relationshipType);
        this.links.push(l);
      }
    });
    // Interpret and create parents
    jsonParents.forEach(parent => {
      let contained = false;
      this.parents.forEach(p => {
        if(parent.id === p.id) {
          contained = true;
        }
      })
      if (!contained) {
        if (parent.parentType === "single") {
          // Find node that is child
          const child: Node = this.nodes.filter(node => node.id === parent.child)[0];

          // Find node that is parent
          const parentNode: Node = this.nodes.filter(node => node.id === parent.parent)[0];

          // Create parentComponent
          const parentComponent: NodeParentComponent = new NodeParentComponent(parent.id, child, parentNode, parent.biological);

          // Add to parents array
          if (!this.parents.includes(parentComponent)) {
            this.parents.push(parentComponent);
          }
        } else {
          // Find node that is child
          const child: Node = this.nodes.filter(node => node.id === parent.child)[0];

          // Find relationship that is parent
          const parentRelationship: Link = this.links.filter(relationship => relationship.id === parent.parent)[0];

          // Create ParentComponent
          const parentComponent: LinkParentComponent = new LinkParentComponent(parent.id, child, parentRelationship, parent.biological);

          // Add ParentComponent to parents array
          if (!this.parents.includes(parentComponent)) {
            this.parents.push(parentComponent);
          }
        }
      }
    });
    this.calculateCoordinates();
  }


  outputNodeEvent(node: Node) {
    this.log("Tree needs info of " + node.firstname);
  }
  /*    outputRelEvent(relationship: Relationship) {
        this.log("Tree received new relationship!")
        this.links.push(relationship);
        this.calculateCoordinates();
      }
      ngOnChanges(changes: SimpleChanges) {
        this.log("Changes")
      }
    */
  calculateCoordinates(): void {
    // Find all people that have no parents and that are not in a relationship with a person that has a parent
    this.nodes.forEach(node => {
      node.x = 0;
      node.y = 0;
    })
    let remainingPeople = this.nodes;
    let remainingParents = this.parents;
    let remainingRelationships = this.links;

    let levels: Node[][] = [];
    let currentLevel = 0;
    while (remainingPeople.length != 0 && currentLevel < 5) {
      levels[currentLevel] = [];
      remainingPeople.forEach(person => {
        if (remainingParents.filter(parent => parent.child === person)[0] === undefined) {
          this.log(person.firstname + " has no unplaced parents");

          // Does 'person' have a relationship with someone that has unplaced parents? (need to look recursively)
          let inAParentRel: Boolean = this.recursiveLooker(remainingRelationships, remainingParents, person, levels, currentLevel);
          this.log(person.firstname + " called recursiveLooker from calculateCoords and received: " + inAParentRel)
          if (!inAParentRel) {
            this.log(person.firstname + " is not in a relationship with someone that has an unplaced parent");
            this.log("Pushing " + person.firstname + " into levels[" + currentLevel + "]");
            levels[currentLevel].push(person);
          } else {
            this.log(person.firstname + " will NOT be pushed in levels[" + currentLevel + "]");
          }
          this.log("\n");
        } else {
          this.log(person.firstname + " has unplaced parents")
        }
      })
      remainingPeople = remainingPeople.filter(person => !levels[currentLevel].includes(person))
      this.log("Remaining unplaced people:")
      this.log(remainingPeople)
      let tmp: ParentComponent[] = [];
      remainingParents.forEach(parent => {
        if (parent instanceof LinkParentComponent) {
          if (!(levels[currentLevel].includes(parent.parent.source) || levels[currentLevel].includes(parent.parent.target))) {
            tmp.push(parent);
          }
        } else if (parent instanceof NodeParentComponent) {
          if (!levels[currentLevel].includes(parent.parent)) {
            tmp.push(parent);
          }
        }
      })
      remainingParents = tmp;
      this.log("remaining parents:");
      this.log(remainingParents);

      this.log("Level " + currentLevel);
      this.log(levels[currentLevel]);
      this.log("\n=================================\n\n")
      currentLevel++;
    }
    let maxWidth = 0;
    levels.forEach(level => { if (maxWidth < level.length) { maxWidth = level.length; } });
    this.log("maxWidth = " + maxWidth);
    let maxHeight = levels.length;
    this.log("height = " + maxHeight);

    // Reorder links

    let curr = 0;
    let movedIds = [];
    levels.forEach(level => {
      // Replacement Node array
      let newLevel: Node[] = [];

      // Checking this level for relationships
      level.forEach(person => {
        let reassigned: boolean = false;
        this.links.forEach(link => {
          //Is this person is in a relationship
          if (link.source === person || link.target === person) {
            let other: Node = (link.source === person ? link.target : link.source);
            if (!movedIds.includes(person.id) && !movedIds.includes(other.id)) {
              this.log("Moving " + person.firstname + " and " + other.firstname);
              newLevel.push(person);
              newLevel.push(other);
              movedIds.push(person.id);
              movedIds.push(other.id);
            }
            reassigned = true;
          }
        })
        if (!reassigned) {
          newLevel.push(person);
        }
      })
      levels[curr] = newLevel;
      curr++;
    })
    // */
    const horizontalStep = 100;
    const verticalStep = 200;
    const offset = 1280 - (maxWidth * horizontalStep + maxWidth * 30)
    // const middle = 
    // Setting coordinates
    for (let i = 0; i < levels.length; i++) {
      for (let j = 0; j < levels[i].length; j++) {
        levels[i][j].x = offset + maxWidth / levels[i].length * j * 100 + 100;
        levels[i][j].y = i * verticalStep + 50;
        this.log(levels[i][j].firstname + ": " + levels[i][j].x + ", " + levels[i][j].y);
      }

    }
    this.links.forEach(l => {
      l.middle = { x: (l.source.x + l.target.x) / 2, y: (l.source.y + l.target.y) / 2 }
    })
    this.parents.forEach(p => p.update());
    this.ready = true;
  }

  recursiveLooker(remainingRelationships: Link[], remainingParents: ParentComponent[], person: Node, levels: Node[][], currentLevel: number): boolean {
    this.log("\t" + "recursive looker with " + person.firstname);
    let inAParentRel: boolean = false;
    remainingRelationships.forEach(rel => {
      if (rel.target === person || rel.source === person) {
        let other: Node = (rel.target === person ? rel.source : rel.target);
        this.log("\t" + person.firstname + " is in a relationship with " + other.firstname);
        remainingParents.forEach(parent => {
          if (parent.child === other) {
            this.log("\t" + other.firstname + " has a parent");
            inAParentRel = true;
          } else if (parent.child === person) {
            inAParentRel = true;
          }
        })
        let tmpPar = remainingParents.filter(parent => parent.child != other);
        let tmpRel = remainingRelationships.filter(rel => !(rel.source === person && rel.target === other || rel.target === person && rel.source === other));
        if (inAParentRel === true) {
          return true;
        }
        inAParentRel = this.recursiveLooker(tmpRel, tmpPar, other, levels, currentLevel);
        if (inAParentRel === true) {
          return true;
        }
      }
    })
    return inAParentRel;
  }

  log(toLog) {
    if (this.logger) {
      this.log(toLog);
    }
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
      if (node !== undefined) {
        this.newContent = true;
        this._nodes.push(node);
        this.calculateCoordinates();
      }
    });
  }
  newRelationship() {
    let dialogRef = this.dialog.open(NewRelationshipDialog, {
      data: this._nodes
    });
    dialogRef.afterClosed().subscribe(relationship => {
      // this.tree.addRelationship(relationship);
      if (relationship !== undefined) {
        this.newContent = true;
        this.links.push(relationship)
        this.calculateCoordinates();
      }
    });
  }
  newParents() {
    let dialogRef = this.dialog.open(NewParentDialog, {
      data: {
        nodes: this._nodes,
        links: this.links
      }
    })
  }

  saveContent() {
    this.savingContent = true;
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