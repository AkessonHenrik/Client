import { Component } from '@angular/core';
import { Link, Node } from '../d3'

export class ParentComponent{
  child: Node;
  link: Link;
  x1;
  y1;
  x2;
  y2;
  constructor(child: Node) {
    this.child = child;
  }
}
export class LinkParentComponent extends ParentComponent {
  parent: Link;
  
  constructor(child: Node, parent: Link) {
    super(child);
    this.parent = parent;
    this.x1 = parent.middle.x;
    this.y1 = parent.middle.y;
    this.x2 = this.child.x;
    this.y2 = this.child.y;
    console.log("parent");
    console.log(parent);
    console.log("child");
    console.log(child);
    console.log(this)
  }
}
export class NodeParentComponent extends ParentComponent {
  parent: Node;
  constructor(child: Node, parent: Node) {
    super(child);
    this.parent = parent;
    this.x1 = parent.x;
    this.y1 = parent.y;
    this.x2 = child.x;
    this.y2 = child.y;
  }
}