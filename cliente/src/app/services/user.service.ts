import { Injectable } from '@angular/core';
import { GLOBAL } from './global';
import { Http , Headers , Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {map} from 'rxjs/operators'; 

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public url: string;
  public identity;
  public token;
  public undefined = "undefined";

  constructor(private _http: Http) {
    this.url = GLOBAL.url;

  }

  signup(userToLogin, getHash = null) {
    if (getHash != null) {
      userToLogin.getHash = getHash;
    }

    let params = JSON.stringify(userToLogin); //para pasar a string un JSON

    let headers = new Headers({ 'Content-Type': 'application/json' });

    return this._http.post(this.url + '/login', params, { headers: headers })
      .pipe(map(res => res.json()));  //para consultar al metodo login de la api
  }

  register(user_to_register){
    
    let params = JSON.stringify(user_to_register); //para pasar a string un JSON

    let headers = new Headers({ 'Content-Type': 'application/json' });

    return this._http.post(this.url + '/register', params, { headers: headers })
    .pipe(map(res => res.json())); //para consultar al metodo login de la api
  }

  getIdentidy() {
    let identity = JSON.parse(localStorage.getItem('identity'));

    if (identity != undefined) {
      this.identity = identity;
    } else {
      this.identity = null;
    }
    return this.identity;
  }

  getToken() {
    let token = localStorage.getItem('token');

    if (token != undefined) {
      this.token = token;
    } else {
      this.token = null;
    }
    return this.token;
  }


}