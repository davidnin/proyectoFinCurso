import { Component, OnInit } from '@angular/core';
import { table } from '../../models/table';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { CommentService } from 'src/app/services/comment.service';
import { GLOBAL } from 'src/app/services/global';
import { Reserved } from 'src/app/models/reserved';
import { comment } from 'src/app/models/comment';
@Component({
  selector: 'app-conocenos',
  templateUrl: './conocenos.component.html',
  styleUrls: ['./conocenos.component.css']
})
export class ConocenosComponent implements OnInit {

  public identity;
  public token;
  public url: string;

  public comment: comment;
  public undefined: comment[];
  public commentarios: comment[] = [];
  public commentariosMod: comment[] = [];
  public nombreUser: string;

  public alertMessage;
  public alertRegister: any;

  public id_table: any;

  public fecha: any;
  public fechaReal: any;
  public turno: any;
  public diaModificado: any;
  public fechafinal: any;

  public esUser: boolean = false;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _commentService: CommentService,
  ) {
    this.identity = this._userService.getIdentidy();
    this.comment = new comment(this.identity, '', '', '', null);
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
  }

  ngOnInit() {
    this.estaRegistrado();
    this.obtenerComentarios();
  }

  //Metodo para saber si esta registrado o no y mostrar o no la opcion de crear comentario
  estaRegistrado() {
    if (!this.identity) {
      this.esUser = false;
    } else {
      this.esUser = true;
    }
  }
  //Para obtener todos los comentarios de la gente
  obtenerComentarios() {
    this._commentService.getComments().subscribe(
      response => {
        this.undefined = response.comments.undefined;
        this.commentarios = this.undefined;
        this.obtenerUser();
      },
      error => {
        var errorMessage = <any>error;

        if (errorMessage != null) {
          var body = JSON.parse(error._body); //Filtrar por JSON para obtener aquello que querramos del objeto
          this.alertMessage = body.message;
          console.log(this.alertMessage);
        }
      }
    )
  }

  //Metodo para obtener el nombre del usuario
  obtenerUser() {
    this.commentariosMod = this.commentarios;
    for (var i = 0; i < this.commentariosMod.length; i++) {
      this.obtenerNombre(i);
    }
  }
  ///Con este metodo guardamos en el id del user su nombre
  obtenerNombre(i) {
    this._userService.getUser(this.commentariosMod[i].id_user).subscribe(
      response => {
        this.nombreUser = response.user.name + " " + response.user.lastname;
        this.commentariosMod[i].id_user = this.nombreUser
      },
      error => {
        var errorMessage = <any>error;

        if (errorMessage != null) {
          var body = JSON.parse(error._body); //Filtrar por JSON para obtener aquello que querramos del objeto
          this.alertMessage = body.message;
          console.log(this.alertMessage);
        }
      }
    )
  }
//Para obtener el dia de hoy y guardarlo en el objeto comentario como la fecha de creacion del comentario
  hoyFecha() {
    var hoy = new Date();
    var dd = hoy.getDate();
    var mm = hoy.getMonth() + 1;
    var yyyy = hoy.getFullYear();

    dd = this.addZero(dd);
    mm = this.addZero(mm);

    return dd + '/' + mm + '/' + yyyy;
  }
  //Parte de la funcion del metodo de arriba
  addZero(i) {
    if (i < 10) {
      i = '0' + i;
    }
    return i;
  }
  //Creacion de commentario
  onSubmit() {
    console.log(!this.comment.descripcion)
    if (!this.comment.descripcion || !this.comment.puntuacion || !this.comment.titulo) {
      this.alertMessage = "Lleno";
    } else {
      this.alertMessage = "";
      this.comment.fecha = this.hoyFecha();
      this._commentService.createComment(this.comment).subscribe(
        response => {
          this.obtenerComentarios();
        },
        error => {
          var errorMessage = <any>error;

          if (errorMessage != null) {
            var body = JSON.parse(error._body); //Filtrar por JSON para obtener aquello que querramos del objeto
            this.alertMessage = body.message;
            console.log(this.alertMessage);
          }
        }
      )
    }
  }
}
