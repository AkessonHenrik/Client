import { Node } from './';

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
  relationshipTypes = ["Spouse", "Partner", "Sibling", "Cousin", "Friend", "Other/Unknown"]
  relationshipType: string;
  icon: string;
  constructor(id: number, source, target, relationshipType: string) {
    super(id, source, target);
    this.relationshipType = relationshipType;
    switch (this.relationshipType) {
      case "Spouse": {
        this.icon = '/assets/wedding.svg';
        break;
      }
      case "Partner": {
        this.icon = '/assets/heart.svg';
        break;
      }
    }
  }
  getRelationshipTypeAsNumber(): number {
    return this.relationshipTypes.indexOf(this.relationshipType);
  }
  getTime() {
    console.log("Hai gais");
    if (this.time instanceof String) {
      let res = {
        begintime: this.time
      };
      console.log("Gonna return");
      console.log(res);
      return res;
    } else {
      console.log("gonna return");
      console.log(this.time);
      return this.time
    }
  }
}