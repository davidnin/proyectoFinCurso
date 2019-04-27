import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { table } from '../models/table';
import { Reserved } from '../models/reserved';

@Injectable()
export class TableService {
    public url: string;

    constructor(private _http: Http) {
        this.url = GLOBAL.url;
    }

    getTables(token) {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });
        let options = new RequestOptions({ headers: headers });
        return this._http.get(this.url + '/table/tables', options)
            .map(res => res.json());
    }

    createTable(tabla: table) {
        let params = tabla;
        return this._http.post(this.url + '/table/create', params)
            .map(res => res.json());
    }

    editTable(token, id: string, tabla: table) {
        let params = JSON.stringify(tabla);
        let headers = new Headers({
            'Content-Type': 'application/json'
        });
        console.log(this.url);
        console.log(id);
        console.log(params);
        console.log(headers)
        return this._http.put(this.url + '/table/update/' + id, params, { headers: headers })
            .map(res => res.json());
    }

    getTable(token, id: string) {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });
        let options = new RequestOptions({ headers: headers });
        return this._http.get(this.url + '/table/table/' + id, options)
            .map(res => res.json());
    }
}