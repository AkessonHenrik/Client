import { Component, Input, OnInit } from '@angular/core';
import APP_CONFIG from '../app.config';
import { Node, Link } from '../d3';
import { ParentComponent, NodeParentComponent, LinkParentComponent } from '../parent/parent.component';
import { GraphComponent } from '../visuals/graph/graph.component';
@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnInit {
  @Input('jsonNodes') jsonNodes: [{ id: number, firstName: string, lastName: string, image: string }];
  @Input('jsonRelationships') jsonRelationships: [{ id: number, from: number, to: number }];
  @Input('jsonParents') jsonParents: [{ parent: number, child: number, parentType: string }];
  nodes: Node[] = [];
  links: Link[] = [];
  parents: ParentComponent[] = [];

  constructor() {
    /*
    let eddard = new Node(1, 'https://upload.wikimedia.org/wikipedia/en/5/52/Ned_Stark-Sean_Bean.jpg', "Eddard", "Stark");
    eddard.x = 100;
    eddard.y = 100;
    this.nodes.push(eddard);
    
    let catelyn = new Node(2, 'https://upload.wikimedia.org/wikipedia/en/2/25/Catelyn_Stark-Michelle_Fairley_S3.jpg', "Catelyn", "Stark");
    catelyn.x = 200;
    catelyn.y = 100;
    this.nodes.push(catelyn);
    
    
    let robb = new Node(3, 'http://vignette1.wikia.nocookie.net/gameofthrones/images/e/e9/Robb-3x03.jpg/revision/latest?cb=20130413125346', "Robb", "Stark");
    robb.x = 100;
    robb.y = 200;
    this.nodes.push(robb);
    
    let sansa = new Node(4, 'https://vignette4.wikia.nocookie.net/gameofthrones/images/6/68/Sansa_stark_s6_battle_bastards_infobox.jpg/revision/latest/scale-to-width-down/342?cb=20160807084759', "Sansa", "Stark");
    sansa.x = 200;
    sansa.y = 200;
    this.nodes.push(sansa);
    
    // let other = new Node(5, null, "Other", "Dude");
    // this.nodes.push(other);
    let jon = new Node(6, 'https://static.comicvine.com/uploads/original/11120/111207460/4639880-1104112163-Jon-S.jpg', "Jon", "Snow");
    jon.x = 300;
    jon.y = 200;
    this.nodes.push(jon);


    this.links.push(new Link(1, eddard, catelyn));
    // this.links.push(new Link(2, this.nodes[3], this.nodes[4]));

    this.parents.push(new NodeParentComponent(eddard, jon));
    this.parents.push(new LinkParentComponent(robb, this.links[0]));
    this.parents.push(new LinkParentComponent(sansa, this.links[0]));
    */
    
  }

  ngOnInit() {
    
    this.jsonNodes.forEach(node => {
      const n: Node = new Node(node.id, node.image, node.firstName, node.lastName);
      // console.log("Node: " + n.firstname + ", " + n.id + ", " + n.x + ", " + n.y);
      this.nodes.push(n);
    });

    this.jsonRelationships.forEach(link => {
      let from: Node = this.nodes.filter(node => node.id === link.from)[0];
      // console.log("FROM: " + from.firstname);
      let to: Node = this.nodes.filter(node => node.id === link.to)[0];
      // console.log("TO: " + to.firstname);
      const l: Link = new Link(link.id, from, to);
      // console.log("Link middle: " + l.middle.x);
      this.links.push(l);
    });

    this.jsonParents.forEach(parent => {
      console.log(parent);
      if (parent.parentType === "single") {
        // Need node that is child
        const child: Node = this.nodes.filter(node => node.id === parent.child)[0];

        // Need node that is parent
        const parentNode: Node = this.nodes.filter(node => node.id === parent.parent)[0];
        const parentComponent : NodeParentComponent = new NodeParentComponent(child, parentNode);
        this.parents.push(parentComponent);
      } else {

        // Need node that is child
        const child: Node = this.nodes.filter(node => node.id === parent.child)[0];
        console.log(child);
        // Need relationship that is parent
        const parentRelationship: Link = this.links.filter(relationship => relationship.id === parent.parent)[0];
        const parentComponent : LinkParentComponent = new LinkParentComponent(child, parentRelationship);
        this.parents.push(parentComponent);
      }
    });
    
  }

}
