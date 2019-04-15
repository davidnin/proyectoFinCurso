import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { comment } from '../models/comment';

@Injectable()
export class CommentService {
    public url: string;

    constructor(private _http: Http) {
        this.url = GLOBAL.url;
    }

    getComments() {
        return this._http.get(this.url + '/comment/comments')
            .map(res => res.json());
    }

    createComment(comment: comment) {
        let params = comment;
        return this._http.post(this.url + '/comment/create', params)
            .map(res => res.json());
    }

    editComment(token, id: string, comment: comment) {
        let params = JSON.stringify(comment);
        let headers = new Headers({
            'Content-Type': 'application/json'
        });
        return this._http.put(this.url + '/comment/update/' + id, params, { headers: headers })
            .map(res => res.json());
    }

    getComment(token, id: string) {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });
        let options = new RequestOptions({ headers: headers });
        return this._http.get(this.url + '/comment/comment/' + id, options)
            .map(res => res.json());
    }

    deleteComment(id) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
    
        return this._http.delete(this.url + '/comment/delete/'+id , { headers: headers })
        .map(res => res.json());
    
      }
}