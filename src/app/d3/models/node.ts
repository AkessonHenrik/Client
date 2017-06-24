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
  // width: number = 60;
  // Node profile picture height, unused at this point
  // height: number = 60;
  
  birthDay: string;
  deathDay: string;
  genders = ["male", "female", "other"];
  born: { name: string, description: string, location: { city: string, province: string, country: string }, media: string[] } = { name: "", description: "", location: { city: "", province: "", country: "" }, media: [] };
  died: { name: string, description: string, location: { city: string, province: string, country: string }, media: string[] } = { name: "", description: "", location: { city: "", province: "", country: "" }, media: [] };
  

  firstname: string;
  lastname: string;
  gender: string;

  // Initials font size
  // fontSize: number = 30;

  constructor(id: number, image, firstname: string, lastname: string, gender: number, birthDay: string, deathDay: string, born, died) {
    this.id = id;
    this.image = !image ? globals.defaultAvatar : image;
    this.firstname = firstname;
    this.lastname = lastname;
    this.gender = this.genders[gender];
    this.x = this.y = 0;
    // this.width = 60;
    // this.height = 60;
    this.birthDay = birthDay;
    this.deathDay = deathDay;
    this.born = born;
    this.died = died;
  }
}
