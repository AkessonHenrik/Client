import { Component } from '@angular/core';
import { Link, Node, Relationship } from '../d3'

export abstract class ParentComponent {
  id: number;
  child: Node;
  link: Link;
  parent;
  x1;
  y1;
  x2;
  y2;
  biological: boolean;
  constructor(id: number, child: Node, begin: string) {
    this.begin = begin;
    this.id = id;
    this.child = child;
  }
  begin: string;
  abstract update();
  abstract getType(): number;
}
export class LinkParentComponent extends ParentComponent {

  constructor(id: number, child: Node, parent: Relationship, begin: string) {
    super(id, child, begin);
    this.parent = parent;
    this.x1 = parent.middle.x;
    this.y1 = parent.middle.y;
    this.x2 = this.child.x;
    this.y2 = this.child.y;
  }
  update() {
    if (this.parent instanceof Relationship) {
      this.x1 = this.parent.middle.x;
      this.y1 = this.parent.middle.y;
      this.x2 = this.child.x;
      this.y2 = this.child.y;
    }
  }
  getType(): number { return 1; }
}
export class NodeParentComponent extends ParentComponent {
  constructor(id: number, child: Node, parent: Node, begin: string) {
    super(id, child, begin);
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
  getType(): number { return 2; }
}