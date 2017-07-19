import { OnChanges, OnInit, Component, Inject, NgZone, Input, Output, EventEmitter, ChangeDetectorRef, HostListener, ChangeDetectionStrategy } from '@angular/core';
import APP_CONFIG from '../app.config';
import { Node, Link, Relationship } from '../d3';
import { ParentComponent, NodeParentComponent, LinkParentComponent } from '../parent/parent.component';
import { Http } from '@angular/http';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { MdInputModule } from '@angular/material';
import { SimpleChanges } from '@angular/core';
import { MdSelectModule, MdMenuModule } from '@angular/material';
import { TreeDataService } from '../tree-data.service';
import { ChoiceDialog, NewParentDialog, NewPersonDialog } from './dialogs/';
import { NewRelationshipDialog } from './dialogs/relationshipDialog';
import { ActivatedRoute } from '@angular/router';
import { SearchDialog } from './dialogs/searchDialog';
import * as globals from '../globals';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnInit {
  id: number;
  error: string = "";

  nodes: Node[] = [];
  links: Relationship[] = [];
  parents: ParentComponent[] = [];

  visibleNodes: Node[] = [];
  visibleRelationships: Relationship[] = []
  visibleParents: ParentComponent[] = []

  lastModifications: { type: string, id: number }[] = [];

  newNodes: Node[] = [];
  newEvents = [];
  newRelationships: Relationship[] = [];
  newParents: ParentComponent[] = [];
  ready: boolean = false;
  height: number = Math.min(window.screen.height, 870);
  width: number = window.screen.width;
  newContent: boolean = false;
  logger: boolean = false;
  savingContent: boolean = false;
  currentDateIndex: number;

  constructor(private http: Http, private zone: NgZone, public dialog: MdDialog, private dataService: TreeDataService, private route: ActivatedRoute, private httpService: HttpService) { }
  onRightClickEvent(e: MouseEvent, node: Node) {
    let data = this.dataService.getData(node.id).then(data => {
      this.createData(data.nodes, data.links, data.parents);
    })
  }
  dates: string[] = [];
  setDates() {
    this.dates = [];
    this.nodes.forEach(node => {
      if (this.dates.indexOf(node.bornString) < 0)
        this.dates.push(node.bornString);
      if (this.dates.indexOf(node.diedString) < 0)
        this.dates.push(node.diedString);
      if (this.dates.indexOf(node.diedString) < 0)
        this.dates.push(node.diedString);
    })
    this.links.forEach(link => {
      if (link.beginTime) {
        if (this.dates.indexOf(link.beginTime) < 0)
          this.dates.push(link.beginTime);
        if (link.endTime !== null) {
          if (this.dates.indexOf(link.endTime) < 0)
            this.dates.push(link.endTime);
        }
      } else if (this.dates.indexOf(link.time) < 0) {
        this.dates.push(link.time);
      }
    })
    this.parents.forEach(parent => {
      if (this.dates.indexOf(parent.begin) < 0)
        this.dates.push(parent.begin);
    })
    this.dates.sort();
    this.currentDateIndex = 0;
    this.dates.forEach(date => console.log(date))
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = +params['id'];
      if (this.id) {
        let data = this.dataService.getData(this.id).then(data => {
          this.createData(data.nodes, data.links, data.parents);
          this.resetData();
        }).catch(error => {
          if (error.status === 404) {
            this.error = "User not found, try another user or create a new one"
          } else {
            this.error = "Something went wrong, please try again later"
          }
        })
      }
    })
  }
  timeActivated: boolean = false;
  @Output()
  change
  onTimeChange($event) {
    if ($event.checked) {
      this.timeActivated = true;
      this.filterData();
    } else {
      this.timeActivated = false;
      this.resetData();
    }
  }
  resetData() {
    this.visibleNodes = this.nodes;
    this.visibleRelationships = this.links;
    this.visibleParents = this.parents;
  }
  filterData($event?) {
    console.log("filtering data")
    if ($event) {
      this.currentDateIndex = $event.value;
    } else {
      this.currentDateIndex = 0;
    }
    console.log("index: " + this.currentDateIndex)
    console.log("\n")
    this.visibleNodes = this.nodes.filter(node => {
      return node.bornString <= this.dates[this.currentDateIndex];;
    })
    this.visibleRelationships = this.links.filter(link => {
      if (link.time) {
        return link.time <= this.dates[this.currentDateIndex];
      }
      return link.beginTime <= this.dates[this.currentDateIndex];
    })
    this.visibleParents = this.parents.filter(parent => {
      return parent.begin <= this.dates[this.currentDateIndex];
    })
  }
  createData(
    jsonNodes: [{ id: number, firstname: string, lastname: string, image: string, gender: number, born: string, died: string }],
    jsonRelationships: [{ id: number, profile1: number, profile2: number, type: number, begintime: any, endtime: any, time: string }],
    jsonParents: [{ timedentityid: number, parentsid: number, childid: number, parentType: number }]) {

    // Interpret and create NodeComponents

    if (jsonNodes) {
      jsonNodes.forEach(jsonNode => {
        if (this.nodes.filter(node => node.id === jsonNode.id).length == 0) {
          let n: Node = new Node(jsonNode.id, jsonNode.image, jsonNode.firstname, jsonNode.lastname, jsonNode.gender, null, null, null, null);
          n.bornString = jsonNode.born;
          n.diedString = jsonNode.died;
          this.nodes.push(n);
        }
      })
    }
    if (jsonRelationships) {
      jsonRelationships.forEach(jsonRelationship => {
        if (this.links.filter(link => link.id === jsonRelationship.id).length == 0) {
          let r: Relationship = new Relationship(jsonRelationship.id, this.nodes.filter(node => node.id === jsonRelationship.profile1)[0], this.nodes.filter(node => node.id === jsonRelationship.profile2)[0], jsonRelationship.type);
          if (jsonRelationship.begintime !== null) {
            r.beginTime = jsonRelationship.begintime;
            r.endTime = jsonRelationship.endtime;
          } else {
            r.time = jsonRelationship.time;
          }
          console.log("Rel times: ");
          console.log(r.beginTime + ", " + r.endTime)
          console.log(r.time);
          this.links.push(r);
        }
      })
    }
    if (jsonParents) {
      jsonParents.forEach(jsonParent => {
        if (this.parents.filter(parent => parent.id === jsonParent.timedentityid).length == 0) {
          if (this.nodes.filter(node => node.id === jsonParent.parentsid).length == 0) { // parent is a relationship
            let link = this.links.filter(link => link.id === jsonParent.parentsid)[0];
            this.parents.push(new LinkParentComponent(jsonParent.timedentityid, this.nodes.filter(node => node.id === jsonParent.childid)[0], link, "01-01-01"));
          } else { // parent is a node
            this.parents.push(new NodeParentComponent(jsonParent.timedentityid, this.nodes.filter(node => node.id === jsonParent.childid)[0], this.nodes.filter(node => node.id === jsonParent.parentsid)[0], "01-01-01"));
          }
        }
      })
    }
    this.setDates();
    this.calculateCoordinates();
    // this.calculateCoordinates();
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
    let levels: Node[][] = [];
    let currentLevel = 0;
    while (remainingPeople.length != 0) {
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

    let canvasWidth = .8 * window.screen.width;

    let level0Height = window.screen.height / levels.length / 2

    const horizontalStep = window.screen.width / 10;
    const verticalStep = window.screen.height / 5;
    const offset = this.width / maxWidth / 2//this.width - (maxWidth * (horizontalStep + maxWidth * 30))


    // Setting coordinates
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
          this.newNode();
          break;
        }
        case "relationship": {
          this.newRelationship();
          break;
        }
        case "parent": {
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
        this.lastModifications.push({ type: "node", id: node.id });
        this.calculateCoordinates();
        this.setDates();
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
        this.newEvents.push(relationship.event);
        console.log(this.newEvents);
        this.lastModifications.push({ type: "relationship", id: relationship.id });
        console.log(this.links);
        this.calculateCoordinates();
        this.setDates();
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
        console.log(parent);
        this.newContent = true;
        this.parents.push(parent);
        this.newParents.push(parent);
        this.lastModifications.push({ type: "parent", id: parent.id });
        this.calculateCoordinates();
        this.setDates();
      }
    });
  }
  saveContent() {
    this.savingContent = true;
    this.saveNodes().then(response => {
      if (response === "error") {
        console.log("savenodes didn't work")
      } else {
        this.saveRelationships().then(response => {
          this.saveParents().then(response => {
            this.savingContent = false;
            this.newContent = false;
            this.newNodes = []
            this.newRelationships = []
            this.newParents = []
            this.lastModifications = []
          })
        })
      }
    })
  }

  saveNodes(): Promise<string> {
    return Promise.all(this.newNodes.map(node => this.saveNode(node, this.http))).then(result => {
      if (result.indexOf("stop") >= 0) {
        return Promise.resolve("error")
      }
      return Promise.resolve("Ok");
    })
  }
  saveNode(newNode: Node, http: Http): Promise<string> {
    console.log(newNode)
    return this.httpService.createProfile({
      "firstname": newNode.firstname,
      "lastname": newNode.lastname,
      "gender": globals.genders.indexOf(newNode.gender),
      "profilePicture": newNode.image,
      "birthDay": newNode.birthDay,
      "deathDay": newNode.deathDay,
      "born": newNode.born,
      "died": newNode.died
    }).then(response => {
      if (response === -1) {
        this.error = "Server error";
        this.savingContent = false;
        return "stop";
      }
      newNode.id = response
      return this.saveGhost(newNode, http);
    })
  }

  saveGhost(newNode: Node, http: Http): Promise<string> {
    return this.httpService.createGhost({
      ownerId: globals.getUserId(),
      profileId: newNode.id
    })
  }

  saveRelationships(): Promise<string> {
    return Promise.all(this.newRelationships.map(rel => this.saveRelationship(rel, this.http))).then(_ => {
      return Promise.resolve("Finished");
    })
  }

  saveRelationship(newRelationship: Relationship, http: Http): Promise<string> {
    console.log("saverelationship: " + newRelationship.source.firstname + " - " + newRelationship.target.firstname);
    return this.httpService.createRelationship(newRelationship);
  }

  saveParents(): Promise<string> {
    return Promise.all(this.newParents.map(parent => this.saveParent(parent, this.http))).then(_ => {
      return Promise.resolve("Parents finished");
    })
  }
  saveParent(newParent: ParentComponent, http: Http): Promise<string> {
    return this.httpService.post(globals.parentsEndpoint, {
      // Parent info
      parentType: globals.parentTypes[newParent.getType()],
      parent: {
        type: (newParent instanceof LinkParentComponent ? "relationship" : "single"),
        id: newParent.parent.id
      },
      child: newParent.child.id,
      time: {
        begin: newParent.begin
      }
    }).then(response => {
      newParent.id = response.json().id
      return Promise.resolve("Done");
    })
  }

  search() {
    let dialogRef = this.dialog.open(SearchDialog);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.nodes.filter(node => node.id === result.id).length > 0) {
          console.log("gotit")
        } else {
          console.log(result);
          this.nodes.push(result);
          console.log("NEWNODES");
          console.log(this.newNodes);
          this.calculateCoordinates();
        }
      }
    });
  }

  undo() {
    let lastModification = this.lastModifications.pop();
    console.log(lastModification);
    switch (lastModification.type) {
      case "relationship": {
        this.links = this.links.filter(node => node.id !== lastModification.id)
        this.newRelationships = this.newRelationships.filter(node => node.id !== lastModification.id)
        break;
      }
      case "node": {
        this.nodes = this.nodes.filter(node => node.id !== lastModification.id)
        this.newNodes = this.newNodes.filter(node => node.id !== lastModification.id)
        break;
      }
      case "parent": {
        this.parents = this.parents.filter(parent => parent.id !== lastModification.id);
        this.newParents = this.newParents.filter(parent => parent.id !== lastModification.id);
        break;
      }
    }
    if (this.lastModifications.length === 0) {
      this.newContent = false;
    }
    this.calculateCoordinates();
  }
}