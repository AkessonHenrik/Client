import { Node } from './';

export class Link implements d3.SimulationLinkDatum<Node> {
  // optional - defining optional implementation properties - required for relevant typing assistance
  index?: number;

  // must - defining enforced implementation properties
  source: Node;
  target: Node;
  middle: {x: number, y: number}
  constructor(source, target) {
    this.source = source;
    this.target = target;
    this.middle = {x: (this.source.x + this.target.x)/2, y: (this.source.y + this.target.y)/2}
  }
}
