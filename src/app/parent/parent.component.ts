import { Component } from '@angular/core';
import { Link, Node } from '../d3'
@Component({
  selector: 'app-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.css']
})
export class ParentComponent {
  child: Node;
  link: Link;
  constructor(child: Node) {
    this.child = child;
  }
}
export class LinkParentComponent extends ParentComponent {
  parent: Link;
  constructor(child: Node, parent: Link) {
    super(child);
    this.parent = parent;
    this.link = new Link(child, new Node(parent.middle.x, parent.middle.y));
  }
}
export class NodeParentComponent extends ParentComponent {
  parent: Node;
  constructor(child: Node, parent: Node) {
    super(child);
    this.parent = parent;
    this.link = new Link(child, parent);
  }
}