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
import { ActivatedRoute } from '@angular/router';
import * as globals from '../globals';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnInit {
  nodes: Node[] = [];
  newNodes: Node[] = [];
  id: number;
  links: Relationship[] = [];
  newRelationships: Relationship[] = [];
  newParents: ParentComponent[] = [];
  parents: ParentComponent[] = [];
  ready: boolean = false;
  height: number = window.screen.height;
  width: number = window.screen.width;
  newContent: boolean = false;
  logger: boolean = false;
  savingContent: boolean = false;
  constructor(private http: Http, private zone: NgZone, public dialog: MdDialog, private dataService: TreeDataService, private route: ActivatedRoute) { }
  onRightClickEvent(e: MouseEvent, node: Node) {
    let data = this.dataService.getData(node.id).then(data => {
      this.createData(data.nodes, data.relationships, data.parents);
    })
  }
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = +params['id'];
      if (this.id) {
        let data = this.dataService.getData(this.id).then(data => {
          this.createData(data.nodes, data.links, data.parents);
        })
      }
    })
  }
  createData(
    jsonNodes: [{ id: number, firstname: string, lastname: string, image: string, gender: number }],
    jsonRelationships: [{ id: number, profile1: number, profile2: number, relationshipType: string, time: string, begintime: string, endtime: string }],
    jsonParents: [{ timedentityid: number, parentsid: number, childid: number, parentType: number }]) {
    // Interpret and create NodeComponents
    jsonNodes.forEach(jsonNode => {
      if (this.nodes.filter(node => node.id === jsonNode.id).length == 0)
        this.nodes.push(new Node(jsonNode.id, jsonNode.image, jsonNode.firstname, jsonNode.lastname, jsonNode.gender, null, null, null, null));
    })

    if (jsonRelationships) {
      jsonRelationships.forEach(jsonRelationship => {
        if (this.links.filter(link => link.id === jsonRelationship.id).length == 0) {
          this.links.push(new Relationship(jsonRelationship.id, this.nodes.filter(node => node.id === jsonRelationship.profile1)[0], this.nodes.filter(node => node.id === jsonRelationship.profile2)[0], jsonRelationship.relationshipType));
        }
      })
    }
    if (jsonParents) {
      jsonParents.forEach(jsonParent => {
        if (this.parents.filter(parent => parent.id === jsonParent.timedentityid).length == 0) {
          console.log("new parent");
          console.log(jsonParent);
          if (this.nodes.filter(node => node.id === jsonParent.parentsid).length == 0) { // parent is a relationship
            console.log("Parent is rel");
            let link = this.links.filter(link => link.id === jsonParent.parentsid)[0];
            console.log(link);
            this.parents.push(new LinkParentComponent(jsonParent.timedentityid, this.nodes.filter(node => node.id === jsonParent.childid)[0], link));
          } else { // parent is a node
            console.log("Parent is node");
            this.parents.push(new NodeParentComponent(jsonParent.timedentityid, this.nodes.filter(node => node.id === jsonParent.childid)[0], this.nodes.filter(node => node.id === jsonParent.parentsid)[0]));
          }
        }
      })
    }

    // this.calculateCoordinates();
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
    console.log("People");
    console.log(remainingPeople);
    console.log("Relationships");
    console.log(remainingRelationships);
    console.log("Parents");
    console.log(remainingParents);
    let levels: Node[][] = [];
    let currentLevel = 0;
    while (remainingPeople.length != 0) {
      levels[currentLevel] = [];
      remainingPeople.forEach(person => {
        console.log("Checking: ");
        console.log(person.firstname);
        if (remainingParents.filter(parent => parent.child === person)[0] === undefined) {
          console.log("Haylo")
          // Does 'person' have a relationship with someone that has unplaced parents? (need to look recursively)
          let inAParentRel: Boolean = this.recursiveLooker(remainingRelationships, remainingParents, person, levels, currentLevel);
          if (!inAParentRel) {
            console.log("pushing " + person.firstname)
            levels[currentLevel].push(person);
          }
        }
      })
      remainingPeople = remainingPeople.filter(person => !levels[currentLevel].includes(person))
      let tmp: ParentComponent[] = [];
      remainingParents.forEach(parent => {
        if (parent.getType() == 1) {
          if (!(levels[currentLevel].includes(parent.parent.source) || levels[currentLevel].includes(parent.parent.target))) {
            tmp.push(parent);
          }
        } else if (parent.getType() == 2) {
          if (!levels[currentLevel].includes(parent.parent)) {
            tmp.push(parent);
          }
        }
      })
      remainingParents = tmp;
      currentLevel++;
    }

    // Reorder links
    // let curr = 0;
    // let movedIds = [];
    // levels.forEach(level => {
    //   // Replacement Node array
    //   let newLevel: Node[] = [];

    //   // Checking this level for relationships
    //   level.forEach(person => {
    //     let reassigned: boolean = false;
    //     this.links.forEach(link => {
    //       //Is this person in a relationship
    //       if (link.source === person || link.target === person) {
    //         let other: Node = (link.source === person ? link.target : link.source);
    //         if (!movedIds.includes(person.id) && !movedIds.includes(other.id)) {
    //           newLevel.push(person);
    //           newLevel.push(other);
    //           movedIds.push(person.id);
    //           movedIds.push(other.id);
    //         }
    //         reassigned = true;
    //       }
    //     })
    //     if (!reassigned) {
    //       newLevel.push(person);
    //     }
    //   })
    //   levels[curr] = newLevel;
    //   curr++;
    // })

    this.setCoordinates(levels);
  }


  setCoordinates(levels: Node[][]) {
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
        console.log(levels[i][j])
      }
    }
    this.links.forEach(l => {
      l.middle = { x: (l.source.x + l.target.x) / 2, y: (l.source.y + l.target.y) / 2 }
    })
    this.parents.forEach(p => p.update());
    this.ready = true;
  }

  arrangeNodes(): void {
    let levels: Node[][] = [];
    let remainingPeople: Node[] = this.nodes;
    let remainingParents: ParentComponent[] = this.parents;
    let currentLevel: number = 0;
    while (remainingPeople.length != 0 && levels.length < 5) {
      levels[currentLevel] = [];
      remainingPeople.forEach(node => {
        let inThisLevel: boolean = true;
        remainingParents.forEach(parent => {
          if (parent.child.id === node.id) {
            inThisLevel = false;
            remainingParents = remainingParents.filter(p => p.id === parent.id);
          }
        })
        if (inThisLevel) {
          levels[currentLevel].push(node);
          remainingPeople = remainingPeople.filter(n => n.id != node.id)
        }
      })
      currentLevel++;
    }

    let remainingRelationships: Relationship[] = this.links;

    this.setCoordinates(levels);
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
      if (parent) {
        this.parents.push(parent);
        this.newParents.push(parent);
        this.calculateCoordinates();
      }
    });
  }
  saveContent() {
    this.savingContent = true;
    this.saveNodes().then(response => {
      this.saveRelationships().then(response => {
        this.saveParents().then(response => {
          this.savingContent = false;
          this.newContent = false;
        })
      })
    })
  }

  saveNodes(): Promise<string> {
    return Promise.all(this.newNodes.map(node => this.saveNode(node, this.http))).then(_ => {
      return Promise.resolve("Finished");
    })
  }
  saveNode(newNode: Node, http: Http): Promise<string> {
    return http.post("http://localhost:9000/profile", {
      "firstName": newNode.firstname,
      "lastName": newNode.lastname,
      "gender": newNode.gender,
      "profilePicture": "http://www.rd.com/wp-content/uploads/sites/2/2016/02/06-train-cat-shake-hands.jpg",
      "birthDay": newNode.birthDay,
      "deathDay": newNode.deathDay,
      "born": newNode.born,
      "died": newNode.died
    }).toPromise().then(response => {
      newNode.id = response.json().peopleentityid
      return this.saveGhost(newNode, http);
    })
  }

  saveGhost(newNode: Node, http: Http): Promise<string> {
    return http.post("http://localhost:9000/ghost", {
      ownerId: globals.getUserId(),
      profileId: newNode.id
    }).toPromise().then(response => {
      // Handle error?
      return Promise.resolve("Finished");
    })
  }

  saveRelationships(): Promise<string> {
    return Promise.all(this.newRelationships.map(rel => this.saveRelationship(rel, this.http))).then(_ => {
      return Promise.resolve("Finished");
    })
  }

  saveRelationship(newRelationship: Relationship, http: Http): Promise<string> {
    return http.post("http://localhost:9000/relationships", {
      profile1: newRelationship.source.id,
      profile2: newRelationship.target.id,
      type: newRelationship.getRelationshipTypeAsNumber(),
      time: newRelationship.getTime()
    }).toPromise().then(response => {
      newRelationship.id = response.json().id
      return Promise.resolve("Done");
    })
  }

  saveParents(): Promise<string> {
    return Promise.all(this.newParents.map(parent => this.saveParent(parent, this.http))).then(_ => {
      return Promise.resolve("Parents finished");
    })
  }
  saveParent(newParent: ParentComponent, http: Http): Promise<string> {
    console.log(newParent.child.birthDay)
    return http.post("http://localhost:9000/parents", {
      // Parent info
      parentType: "biological",
      parent: {
        type: (newParent instanceof LinkParentComponent ? "relationship" : "single"),
        id: newParent.parent.id
      },
      child: newParent.child.id,
      time: {
        begin: "01-01-01"//newParent.child.birthDay
      }
    }).toPromise().then(response => {
      newParent.id = response.json().id
      return Promise.resolve("Done");
    })
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
  parent: { type: string, id: number };
  child: number;
  nodes: Node[];
  links: Relationship[];
  createNewParent() {
    if (this.parent && this.child && this.parentType) {
      let newParent: ParentComponent;
      if (this.parent.type === 'link') {
        newParent = new LinkParentComponent(Math.ceil(Math.random() * 100), this.nodes.filter(node => node.id === this.child)[0], this.links.filter(link => link.id === this.parent.id)[0]);
      } else if (this.parent.type === 'node') {
        newParent = new NodeParentComponent(Math.ceil(Math.random() * 100), this.nodes.filter(node => node.id === this.child)[0], this.nodes.filter(node => node.id === this.parent.id)[0]);
      }
      this.dialogRef.close(newParent);
    }
  }
  constructor( @Inject(MD_DIALOG_DATA) private data: { nodes: Node[], links: Relationship[] }, public dialogRef: MdDialogRef<NewParentDialog>) {

  }
  public ngOnInit() {
    this.nodes = this.data.nodes;
    this.links = this.data.links;
  }
}