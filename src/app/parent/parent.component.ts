import { Component } from '@angular/core';
import { Link, Node } from '../d3'

export abstract class ParentComponent {
  id: number;
  child: Node;
  link: Link;
  x1;
  y1;
  x2;
  y2;
  biological: boolean;
  constructor(id: number, child: Node, biological: boolean) {
    this.id = id;
    this.child = child;
    this.biological = biological;
  }
  abstract update();
}
export class LinkParentComponent extends ParentComponent {
  parent: Link;

  constructor(id: number, child: Node, parent: Link, biological: boolean) {
    super(id, child, biological);
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
  constructor(id: number, child: Node, parent: Node, biological: boolean) {
    super(id, child, biological);
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