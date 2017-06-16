import * as globals from '../../globals'

export class Node {
  // Node x coordinate
  x: number;
  // Node y coordinate
  y: number;
  // Image path, can be local or external
  image: string;
  // Node id, obtained from server data
  id: number;
  // Node profile picture width
  width: number = 60;
  // Node profile picture height, unused at this point
  height: number = 60;

  firstname: string;
  lastName: string;

  // Initials font size
  fontSize: number = 30;

  constructor(id: number, image, firstName: string, lastName: string) {
    this.id = id;
    this.image = !image ? globals.defaultAvatar : image;
    this.firstname = firstName;
    this.lastName = lastName;
    this.x = this.y = 0;
    this.width = 60;
    this.height = 60;
  }
}
