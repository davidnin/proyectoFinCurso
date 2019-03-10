import { Injectable } from '@angular/core';
import { GLOBAL } from './global';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import 'rxjs/Rx';
import { Identifiers } from '@angular/compiler';
import { Reserved } from '../models/reserved';

@Injectable({
  providedIn: 'root'
})
export class ReservedService {
  public url: string;
  public identity;
  public token;
  public undefined = "undefined";

  constructor(private _http: Http) {
    this.url = GLOBAL.url;

  }

  createReserve(reserved) {
    let params = JSON.stringify(reserved); //para pasar a string un JSON

    let headers = new Headers({ 'Content-Type': 'application/json' });

    return this._http.post(this.url + '/reserved/create', params, { headers: headers })
      .pipe(map(res => res.json())); //para consultar al metodo login de la api
  }

}