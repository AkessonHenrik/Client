import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import * as globals from './globals';
import { Relationship } from './d3/models/link';
@Injectable()
export class HttpService {

  constructor(private http: Http) { }

  upload(file: File): Promise<any> {
    let formData: FormData = new FormData();
    formData.append('file', file, file.name);
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    let options = new RequestOptions({ headers: headers });
    return this.http.post(globals.server + "/upload", formData, options)
      .toPromise().then(response => {
        return response.json();
      })
  }

  updateProfile(newProfileInfo, profileId): Promise<any> {
    return this.http.patch(globals.profileEndpoint + "/" + profileId, newProfileInfo).toPromise().then(response => {
      console.log(response);
    })
  }
  getComments(postid: number): Promise<any> {
    console.log("C'mon get " + postid)
    return this.http.get(globals.commentEndpoint + "/" + postid).toPromise().then(response => {
      return Promise.resolve(response.json())
    })
  }

  postComment(comment): Promise<any> {
    return this.http.post(globals.commentEndpoint, comment).toPromise();
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
    }).catch(error => {
      return Promise.resolve(-1);
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

  createGhost(ghostData): Promise<any> {
    return this.http.post(globals.ghostEndpoint, ghostData).toPromise()
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
        newRelationship.event.owner = newRelationship.id;
        return this.addEvent(newRelationship.event.getAsObject());
      }
    })
  }


  getEvent(id: number): Promise<any> {
    return this.http.get(globals.eventEndpoint + "/" + id).toPromise().then(response => {
      return Promise.resolve(response);
    }).catch(error => {
      return Promise.resolve(404)
    })
  }



}
