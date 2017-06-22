import { OnChanges, OnInit, Component, Inject, NgZone, Input, Output, EventEmitter, ChangeDetectorRef, HostListener, ChangeDetectionStrategy } from '@angular/core';
import APP_CONFIG from '../app.config';
import { Node, Link, Relationship } from '../d3';
import { ParentComponent, NodeParentComponent, LinkParentComponent } from '../parent/parent.component';
import { Http } from '@angular/http';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { MdInputModule } from '@angular/material';
import { SimpleChanges } from '@angular/core';
import { MdSelectModule, MdMenuModule } from '@angular/material';
import { TreeDataService } from '../tree-data.service';
import { ChoiceDialog } from './dialogs/choiceDialog';
import { NewPersonDialog } from './dialogs/personDialog';
import { NewRelationshipDialog } from './dialogs/relationshipDialog';
@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnInit {
  nodes: Node[] = [];
  newNodes: Node[] = [];
  links: Link[] = [];
  newRelationships: Link[] = [];
  newParents: ParentComponent[] = [];
  parents: ParentComponent[] = [];
  ready: boolean = false;
  // height: number = 1000;
  // width: number = 1600;
  height: number = window.screen.height;
  width: number = window.screen.width;
  newContent: boolean = false;
  logger: boolean = false;
  savingContent: boolean = false;
  constructor(private http: Http, private zone: NgZone, public dialog: MdDialog, private dataService: TreeDataService) { }
  onRightClickEvent(e: MouseEvent, node: Node) {
    let data = this.dataService.getData(node.id).then(data => {
      this.createData(data.nodes, data.links, data.parents);
    })
  }
  ngOnInit() {
    let data = this.dataService.getData(2).then(data => {
      console.log("data");
      console.log(data);
      this.createData(data.nodes, data.links, data.parents);
    })
  }
  createData(
    jsonNodes: [{ id: number, firstname: string, lastname: string, image: string }],
    jsonRelationships: [{ id: number, profile1: number, profile2: number, relationshipType: string }],
    jsonParents: [{ id: number, parent: number, child: number, parentType: string, biological: boolean }]) {
    // Interpret and create NodeComponents
    jsonNodes.forEach(node => {
      let contained: boolean = false;
      this.nodes.forEach(n => {
        if (n.id === node.id) {
          contained = true;
        }
      })
      if (!contained) {
        const n: Node = new Node(node.id, node.image, node.firstname, node.lastname);
        this.nodes.push(n);
      }
    });

    // Interpret and create relationships (Link)
    jsonRelationships.forEach(link => {
      let contained: boolean = false;
      this.links.forEach(l => {
        if (l.id === link.id) {
          contained = true;
        }
      })
      if (!contained) {
        let profile1: Node = this.nodes.filter(node => node.id === link.profile1)[0];
        let to: Node = this.nodes.filter(node => node.id === link.profile2)[0];
        const l: Relationship = new Relationship(link.id, profile1, to, link.relationshipType);
        this.links.push(l);
      }
    });
    // Interpret and create parents
    jsonParents.forEach(parent => {
      let contained = false;
      this.parents.forEach(p => {
        if (parent.id === p.id) {
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
  }
  calculateCoordinates(): void {
    // Find all people that have no parents and that are not in a relationship with a person that has a parent
    this.nodes.forEach(node => {
      node.x = 0;
      node.y = 0;
    })
    let remainingPeople = this.nodes;
    let remainingParents = this.parents;
    let remainingRelationships = this.links;
    console.log(remainingRelationships);
    let levels: Node[][] = [];
    let currentLevel = 0;
    while (remainingPeople.length != 0 && currentLevel < 5) {
      levels[currentLevel] = [];
      remainingPeople.forEach(person => {
        if (remainingParents.filter(parent => parent.child === person)[0] === undefined) {
          // Does 'person' have a relationship with someone that has unplaced parents? (need to look recursively)
          let inAParentRel: Boolean = this.recursiveLooker(remainingRelationships, remainingParents, person, levels, currentLevel);
          if (!inAParentRel) {
            levels[currentLevel].push(person);
          }
        }
      })
      remainingPeople = remainingPeople.filter(person => !levels[currentLevel].includes(person))
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
      currentLevel++;
    }

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

    let maxWidth = 0;
    let maxWidthIndex = -1;
    levels.forEach(level => { if (maxWidth < level.length) { maxWidth = level.length; maxWidthIndex = levels.indexOf(level); } });
    const maxHeight = levels.length;
    console.log("MAXWIDTHINDEX = " + maxWidthIndex)

    let canvasWidth = .8 * window.screen.width;

    let level0Height = window.screen.height / levels.length / 2
    console.log("level0height: " + level0Height)

    const horizontalStep = window.screen.width / 10;
    const verticalStep = window.screen.height / 5;
    const offset = this.width / maxWidth / 2//this.width - (maxWidth * (horizontalStep + maxWidth * 30))

    console.log("offset = " + offset)

    // Setting coordinates
    console.log("levels");
    console.log(levels);
    for (let i = 0; i < levels.length; i++) {
      for (let j = 0; j < levels[i].length; j++) {
        levels[i][j].x = offset + maxWidth / levels[i].length * j * 100 + 100;
        levels[i][j].y = i * verticalStep + level0Height;
      }
    }
    this.links.forEach(l => {
      l.middle = { x: (l.source.x + l.target.x) / 2, y: (l.source.y + l.target.y) / 2 }
    })
    this.parents.forEach(p => p.update());
    this.ready = true;
  }
  recursiveLooker(remainingRelationships: Link[], remainingParents: ParentComponent[], person: Node, levels: Node[][], currentLevel: number): boolean {
    let inAParentRel: boolean = false;
    remainingRelationships.forEach(rel => {
      if (rel.target === person || rel.source === person) {
        let other: Node = (rel.target === person ? rel.source : rel.target);
        remainingParents.forEach(parent => {
          if (parent.child === other) {
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
        case "parent": {
          console.log("Chose new parent");
          this.newParent();
          break;
        }
      }
    });
  }
  newNode() {
    let dialogRef = this.dialog.open(NewPersonDialog);
    dialogRef.afterClosed().subscribe(node => {
      console.log("hello")
      if (node !== undefined) {
        this.newContent = true;
        this.nodes.push(node);
        this.newNodes.push(node);
        console.log(this.newNodes);
        this.calculateCoordinates();
      }
    });
  }
  newRelationship() {
    let dialogRef = this.dialog.open(NewRelationshipDialog, {
      data: this.nodes
    });
    dialogRef.afterClosed().subscribe(relationship => {
      if (relationship !== undefined) {
        this.newContent = true;
        this.links.push(relationship)
        this.newRelationships.push(relationship);
        console.log(this.newRelationships);
        this.calculateCoordinates();
      }
    });
  }
  newParent() {
    let dialogRef = this.dialog.open(NewParentDialog, {
      data: {
        nodes: this.nodes,
        links: this.links
      }
    })
    dialogRef.afterClosed().subscribe(parent => {
      this.parents.push(parent);
      this.newParents.push(parent);
      this.calculateCoordinates();
    });
  }
  saveContent() {
    this.savingContent = true;
  }
}


@Component({
  selector: 'parentdialog',
  templateUrl: './dialogs/parentdialog.html',
  styleUrls: ['./dialogs/persondialog.css']
})
export class NewParentDialog implements OnInit {

  parentType: string;
  parentTypes: string[] = ["Adoptive", "Biological", "Guardian"]
  parent: {type: string, id: number };
  child: number;
  nodes: Node[];
  links: Link[];
  createNewParent() {
    console.log(this.parentType);
    console.log(this.parent);
    console.log(this.child);
    let newParent: ParentComponent;
    if (this.parent.type === 'link') {
      console.log("link")
      newParent = new LinkParentComponent(Math.ceil(Math.random()*100), this.nodes.filter(node => node.id === this.child)[0], this.links.filter(link => link.id === this.parent.id)[0], true);
    } else if (this.parent.type === 'node') {
      console.log("node")
      newParent = new NodeParentComponent(Math.ceil(Math.random()*100), this.nodes.filter(node => node.id === this.child)[0], this.nodes.filter(node => node.id === this.parent.id)[0], true);
    }
        this.dialogRef.close(newParent);
  }
  constructor( @Inject(MD_DIALOG_DATA) private data: { nodes: Node[], links: Link[] }, public dialogRef: MdDialogRef<NewParentDialog>) {

  }
  public ngOnInit() {
    this.nodes = this.data.nodes;
    this.links = this.data.links;
  }
}