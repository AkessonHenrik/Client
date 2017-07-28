import * as globals from '../../globals'

export class Node {
  // Node x coordinate
  x: number;
  // Node y coordinate
  y: number;
  // Image path
  image: string;
  // Node id, obtained from server data
  id: number;

  birthDay: string;
  deathDay: string;
  genders = ["male", "female", "other"];
  born: {
    name: string,
    description: string,
    location: {
      city: string,
      province: string,
      country: string
    },
    media: string[]
  } = {
    name: "",
    description: "",
    location: {
      city: "",
      province: "",
      country: ""
    },
    media: []
  };
  died: {
    name: string,
    description: string,
    location: {
      city: string,
      province: string,
      country: string
    },
    media: string[]
  } = {
    name: "",
    description: "",
    location: {
      city: "",
      province: "",
      country: ""
    },
    media: []
  };


  firstname: string;
  lastname: string;
  gender: string;
  bornString: string;
  diedString: string;

  visibility;

  constructor(id: number, image, firstname: string, lastname: string, gender: number, birthDay: string, deathDay: string, born, died) {
    this.id = id;
    this.image = image;
    this.firstname = firstname;
    this.lastname = lastname;
    this.gender = this.genders[gender];
    this.x = this.y = 0;
    this.birthDay = birthDay;
    this.deathDay = deathDay;
    this.born = born;
    this.died = died;
  }
}