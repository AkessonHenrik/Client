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
  _image: string;
  id: number;
  linkCount: number = 0;
  r: number;
  width: number | string;
  height: number | string;
  firstname: string;
  fontSize: number = 30;
  lastName: string;

  constructor(id: number, image, firstName: string, lastName: string) {
    this.id = id;
    if (image !== undefined) {
      this._image = image;
    } else {
      this._image = 'https://freeiconshop.com/wp-content/uploads/edd/person-solid.png?arbitrary'
    }
    this.firstname = firstName;
    this.lastName = lastName;
    this.width = 60;
    this.height = 60;
    this.r = 30;
  }

  get image() {
    return this._image;
  }
  normal = () => {
    return Math.sqrt(this.linkCount / APP_CONFIG.N);
  }

  get color() {
    let index = Math.floor(APP_CONFIG.SPECTRUM.length * this.normal());
    return APP_CONFIG.SPECTRUM[index];
  }
}
