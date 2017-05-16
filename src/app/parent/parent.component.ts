import { Component } from '@angular/core';
import { Link, Node } from '../d3'

export abstract class ParentComponent {
  child: Node;
  link: Link;
  x1;
  y1;
  x2;
  y2;
  constructor(child: Node) {
    this.child = child;
  }
  abstract update();
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
  }
  update() {
    this.x1 = this.parent.middle.x;
    this.y1 = this.parent.middle.y;
    this.x2 = this.child.x;
    this.y2 = this.child.y;
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
  update() {
    this.x1 = this.parent.x;
    this.y1 = this.parent.y;
    this.x2 = this.child.x;
    this.y2 = this.child.y;
  }
}