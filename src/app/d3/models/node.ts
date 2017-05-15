import APP_CONFIG from '../../app.config'

export class Node implements d3.SimulationNodeDatum {
  // optional - defining optional implementation properties - required for relevant typing assistance
  index?: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
  image: string;
  id: number;
  linkCount: number = 0;
  r: number;

  constructor(id, x, y, image='https://freeiconshop.com/wp-content/uploads/edd/person-solid.png', r=30) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.image = image;
    this.r = r;
  }

  normal = () => {
    return Math.sqrt(this.linkCount / APP_CONFIG.N);
  }

  get fontSize() {
    return (30 + 'px');
  }

  get color() {
    let index = Math.floor(APP_CONFIG.SPECTRUM.length * this.normal());
    return APP_CONFIG.SPECTRUM[index];
  }
}
