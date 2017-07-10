import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import * as globals from './globals';
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
        console.log("Uploaded media");
        return response.json();
      })
  }

  addEvent(event): Promise<any> {
    console.log(5);
    console.log("Sending:");
    console.log(event);
    return this.http.post(globals.eventEndpoint, event).toPromise().then(response => {
      console.log(response);
      return Promise.resolve(response.json())
    })
  }
}
