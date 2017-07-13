import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import * as globals from './globals';
import { Relationship } from './d3/models/link';
@Injectable()
export class HttpService {

  constructor(private http: Http) { }

  upload(file: File): Promise<string> {
    let formData: FormData = new FormData();
    formData.append('picture', file, file.name);
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    let options = new RequestOptions({ headers: headers });
    return this.http.post(globals.server + "/upload", formData, options)
      .toPromise().then(response => {
        return response.json();
      })
  }

  addEvent(event): Promise<any> {
    return this.http.post(globals.eventEndpoint, event).toPromise().then(response => {
      return Promise.resolve(response.json())
    })
  }

  createAccount(accountData) {
    return this.http.post(globals.signupEndpoint, accountData)
  }
  createProfile(profileData): Promise<number> {
    return this.http.post(globals.profileEndpoint, profileData).toPromise().then(response => {
      let body = response.json();
      let id: number = body.peopleentityid;
      return id;
    })
  }

  search(firstname, lastname): Promise<any> {
    return this.http.post(globals.server + "/search", {
      firstname: firstname,
      lastname: lastname
    }).toPromise().then(response => {
      return Promise.resolve(response.json());
    })
  }

  post(url, data) {
    return this.http.post(url, data).toPromise().then(response => { return Promise.resolve(response) });
  }


  createRelationship(newRelationship: Relationship): Promise<any> {
    return this.http.post(globals.relationshipsEndpoint, {
      profile1: newRelationship.source.id,
      profile2: newRelationship.target.id,
      type: newRelationship.getRelationshipTypeAsNumber(),
      time: newRelationship.getTime()
    }).toPromise().then(response => {
      newRelationship.id = response.json().id
      if (newRelationship.event) {
        newRelationship.event.id = newRelationship.id;
      }
      return this.addEvent(newRelationship.event.getAsObject());
    })
  }


  getEvent(id: number): Promise<any> {
    return this.http.get(globals.eventEndpoint + "/" + id).toPromise().then(response => {
      return Promise.resolve(response);
    })
  }
}
