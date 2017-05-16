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
  width: number;
  height: number;
  firstname: string;
  lastName: string;

  constructor(id: number, image, firstName: string, lastName: string, width = 40, height = 40) {
    this.id = id;
    if (image !== undefined) {
      this.image = image;
    } else {
      this.image = 'https://freeiconshop.com/wp-content/uploads/edd/person-solid.png'
    }
    this.firstname = firstName;
    this.lastName = lastName;
    this.width = width;
    this.height = height;
    this.x = Math.random() * 1000;
    this.y = Math.random() * 1000;
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
