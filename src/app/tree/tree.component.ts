import { Component, OnInit } from '@angular/core';
import APP_CONFIG from '../app.config';
import { Node, Link } from '../d3';
import { ParentComponent, NodeParentComponent, LinkParentComponent } from '../parent/parent.component';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnInit {
  nodes: Node[] = [];
  links: Link[] = [];
  parents: ParentComponent[] = [];
  constructor() {
    this.nodes.push(new Node(100, 100, 'https://upload.wikimedia.org/wikipedia/en/5/52/Ned_Stark-Sean_Bean.jpg'));
    this.nodes.push(new Node(300, 100, 'https://upload.wikimedia.org/wikipedia/en/2/25/Catelyn_Stark-Michelle_Fairley_S3.jpg'));
    this.nodes.push(new Node(200, 200, 'http://vignette1.wikia.nocookie.net/gameofthrones/images/e/e9/Robb-3x03.jpg/revision/latest?cb=20130413125346'));
    this.nodes.push(new Node(400, 100, 'https://vignette2.wikia.nocookie.net/bane/images/3/3f/Littlefinger.jpg/revision/latest?cb=20151118153727'));
    this.nodes.push(new Node(500, 100));
    this.nodes.push(new Node(100, 200, 'https://static.comicvine.com/uploads/original/11120/111207460/4639880-1104112163-Jon-S.jpg'))


    this.links.push(new Link(this.nodes[0], this.nodes[1]));
    this.links.push(new Link(this.nodes[3], this.nodes[4]));

    this.parents.push(new NodeParentComponent(this.nodes[0], this.nodes[5]));
    this.parents.push(new LinkParentComponent(this.nodes[2], this.links[0]));
  }

  ngOnInit() {
  }

}
