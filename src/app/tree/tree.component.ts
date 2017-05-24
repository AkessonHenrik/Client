import { Component, Input, OnInit, OnChanges } from '@angular/core';
import APP_CONFIG from '../app.config';
import { Node, Link, Relationship } from '../d3';
import { ParentComponent, NodeParentComponent, LinkParentComponent } from '../parent/parent.component';
import { GraphComponent } from '../visuals/graph/graph.component';
import { SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnInit, OnChanges {
  @Input('jsonNodes') jsonNodes: [{ id: number, firstName: string, lastName: string, image: string }];
  @Input('jsonRelationships') jsonRelationships: [{ id: number, from: number, to: number, relationshipType: string }];
  @Input('jsonParents') jsonParents: [{ parent: number, child: number, parentType: string, biological: boolean }];
  nodes: Node[] = [];
  links: Link[] = [];
  parents: ParentComponent[] = [];

  get _nodes() {
    return this.nodes;
  }

  logger: boolean = false;

  onComponentChange(value) {
    console.log(value);
  }

  outputNodeEvent(node: Node) {
    console.log("Change in tree!")
  }
  outputRelEvent(relationship: Relationship) {
    console.log("Change in tree!")
    this.links.push(relationship);
    this.calculateCoordinates();
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log("Changes")
  }
  ngOnInit() {
    // Interpret and create NodeComponents
    this.jsonNodes.forEach(node => {
      const n: Node = new Node(node.id, node.image, node.firstName, node.lastName);
      this.nodes.push(n);
    });

    // Interpret and create relationships (Link)
    this.jsonRelationships.forEach(link => {
      let from: Node = this.nodes.filter(node => node.id === link.from)[0];
      let to: Node = this.nodes.filter(node => node.id === link.to)[0];
      const l: Relationship = new Relationship(link.id, from, to, link.relationshipType);
      this.links.push(l);
    });

    // Interpret and create parents
    this.jsonParents.forEach(parent => {
      if (parent.parentType === "single") {
        // Find node that is child
        const child: Node = this.nodes.filter(node => node.id === parent.child)[0];

        // Find node that is parent
        const parentNode: Node = this.nodes.filter(node => node.id === parent.parent)[0];

        // Create parentComponent
        const parentComponent: NodeParentComponent = new NodeParentComponent(child, parentNode, parent.biological);

        // Add to parents array
        this.parents.push(parentComponent);
      } else {
        // Find node that is child
        const child: Node = this.nodes.filter(node => node.id === parent.child)[0];

        // Find relationship that is parent
        const parentRelationship: Link = this.links.filter(relationship => relationship.id === parent.parent)[0];

        // Create ParentComponent
        const parentComponent: LinkParentComponent = new LinkParentComponent(child, parentRelationship, parent.biological);

        // Add ParentComponent to parents array
        this.parents.push(parentComponent);
      }
    });
    this.calculateCoordinates();
  }

  calculateCoordinates(): void {
    this.log("\n========================\n\n")
    this.log("Calculate Coordinates");
    this.log("\n========================\n\n")
    // Find all people that have no parents and that are not in a relationship with a person that has a parent
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
    localStorage["nodes"] = this.nodes;
    localStorage["links"] = this.links;
    localStorage["parents"] = this.parents;
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
        // this.log("\t" + "tmpPar:");
        // this.log("\t" + tmpPar);
        let tmpRel = remainingRelationships.filter(rel => !(rel.source === person && rel.target === other || rel.target === person && rel.source === other));
        // this.log("\t" + "tmpRel:");
        // this.log("\t" + tmpRel);
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
      console.log(toLog);
    }
  }
  addNode(node: Node) {
    console.log("addNode")
    this.nodes.push(node);
    console.log(this.nodes)
    this.calculateCoordinates();
  }
  addRelationship(relationship: Relationship) {
    this.links.push(relationship);
    this.calculateCoordinates();
  }
}