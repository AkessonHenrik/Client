import { Node } from './';
import * as globals from '../../globals';
import { EventComponent, LocatedEventComponent } from '../../event/event.component';
export abstract class Link {
  source: Node;
  target: Node;
  middle: { x: number, y: number }
  id: number;
  relationshipType: string;
  time: any;
  constructor(id: number, source, target) {
    this.id = id;
    this.source = source;
    this.target = target;
    this.middle = { x: (this.source.x + this.target.x) / 2, y: (this.source.y + this.target.y) / 2 }
  }
  abstract getRelationshipTypeAsNumber(): number;
  abstract getTime();
}

export class Relationship extends Link {
  relationshipType: string;
  event: EventComponent | LocatedEventComponent;
  icon: string;
  beginTime: string;
  endTime: string;
  visibility;
  constructor(id: number, source, target, type: number, event?: EventComponent) {
    super(id, source, target);
    this.relationshipType = globals.relationshipTypes[type];
    this.icon = globals.relationshipIcons[type];
    this.event = event;
  }
  getRelationshipTypeAsNumber(): number {
    return globals.relationshipTypes.indexOf(this.relationshipType);
  }
  getTime() {
    if (this.time instanceof String) {
      let res = {
        begintime: this.time
      };
      return res;
    } else {
      return this.time
    }
  }
}