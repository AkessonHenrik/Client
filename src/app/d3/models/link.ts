import { Node } from './';

export class Link implements d3.SimulationLinkDatum<Node> {
  // optional - defining optional implementation properties - required for relevant typing assistance
  index?: number;

  // must - defining enforced implementation properties
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
        console.log(this.relationshipType)
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