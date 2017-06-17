import { Node } from './';

export class Link {
  source: Node;
  target: Node;
  middle: { x: number, y: number }
  id: number;
  relationshipType: string;
  constructor(id: number, source, target) {
    this.id = id;
    this.source = source;
    this.target = target;
    this.middle = { x: (this.source.x + this.target.x) / 2, y: (this.source.y + this.target.y) / 2 }
  }
}

export class Relationship extends Link {
  relationshipTypes = ["Spouse", "Partner", "Sibling", "Cousin", "Friend", "Other/Unknown"]
  relationshipType: string;
  icon: string;
  constructor(id: number, source, target, relationshipType: string) {
    super(id, source, target);
    this.relationshipType = relationshipType;
    switch(this.relationshipType) {
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
}