import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { ReservedService } from 'src/app/services/reserved.service';
import { Reserved } from 'src/app/models/reserved';
import { identity } from 'rxjs';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { TableService } from 'src/app/services/table.service';
import { CommentService } from 'src/app/services/comment.service';
import { comment } from 'src/app/models/comment';

@Component({
    selector: 'app-config-user',
    templateUrl: './config-user.component.html',
    styleUrls: ['./config-user.component.css']
})

export class ConfigUserComponent implements OnInit {

    public titulo: string;
    public user: User;
    public identity;
    public token;
    public alertMessage;
    public url: string;
    alertRegister: string;

    public esAdmin: boolean;

    public reservas: Reserved[];
    public undefined: Reserved[];
    public reservaPorId: Reserved[];

    public reservasMod: Reserved[];
    public nombreDelUsuario: any;
    public mesaDelUsuario: any;

    public commentarios: comment[] = [];
    public commentariosUser: comment[] = [];
    public commentariosMod: comment[] = [];

    constructor(
        private _userService: UserService,
        private _tableService: TableService,
        private _reservedService: ReservedService,
        private _commentService: CommentService
    ) {
        this.titulo = "Actualizar los datos"
        //Aqui abajo se interactua con las sesiones del user locaStorage
        this.identity = this._userService.getIdentidy();
        this.token = this._userService.getToken();
        this.user = this.identity;

    }

    ngOnInit() {
        console.log("user-edit-component-ts cargado");
        this.opcionPerfil();
        this.obtenerReservas();
        this.obtenerComentarios();
    }

    opcionPerfil() {
        if (this.user.role == "ROLE-ADMIN") {
            this.esAdmin = true;
        } else {
            this.esAdmin = false;
        }
    }

    obtenerComentarios() {
        this._commentService.getComments().subscribe(
            response => {
                this.commentarios = response.comments.undefined;
                this.commentariosMod = response.comments.undefined
                this.obtenerUserComment();
                this.obtenerComentariosUser();
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

    obtenerUserComment() {
        this.commentariosMod = this.commentarios;
        for (var i = 0; i < this.commentariosMod.length; i++) {
            this.obtenerNombreComment(i);
        }
    }
    obtenerNombreComment(i) {
        this._userService.getUser(this.commentariosMod[i].id_user).subscribe(
            response => {
                this.commentariosMod[i].id_user = response.user.name + " " + response.user.lastname;
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
    obtenerComentariosUser() {
        this.commentariosUser = [];
        console.log(this.commentarios);
        for (var i = 0; i < this.commentarios.length; i++) {
            if (this.commentarios[i].id_user == this.identity._id) {
                this.commentariosUser.push(this.commentarios[i]);
            }
        }
    }

    eliminarCommentario(id) {
        this._commentService.deleteComment(id).subscribe(
            response => {
                console.log(response)
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
        );
    }

    onSubmit() {
        console.log(this.user);

        this._userService.updateUser(this.user).subscribe(
            response => {
                console.log(this.user)
                this.user = response.user;

                if (!response.user) {
                    this.alertMessage = "El usuario no se ha actualizad";
                } else {
                    //this.user = response.user;
                    localStorage.setItem('identity', JSON.stringify(this.user));

                    if (!this.filesToUpload) {

                    } else { }
                    this.alertMessage = "Datos actualizados correctamente";
                    this.alertRegister = "La actualizacion del usuario ha sido correcta";

                }
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

    public filesToUpload: Array<File>;

    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files; //Nos recoje los archivos seleccionados en el input y lo guardamos en un array
        console.log(this.filesToUpload);
    }

    makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
        var token = this.token;

        return new Promise(function (resolve, reject) {
            var formData: any = new FormData();
            var xhr = new XMLHttpRequest;

            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }
                }
            }
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Authorization', token);
            xhr.send(formData);
        })
    }

    obtenerReservas() {
        this._reservedService.getReserves().subscribe(
            response => {
                if (!response.reserveds) {
                    this.alertMessage = "Error a la hora de cargar las tablas. Por favor, dejenos constancia de ello enviando un correo a nuestra cuenta ···· "
                } else {
                    this.undefined = response.reserveds;
                    this.reservas = this.undefined;
                    this.obtenerUser();
                    this.obtenerMesa();
                    this.filtrarReservas();
                }
            },
            error => {
                var errorMessage = <any>error;

                if (errorMessage != null) {
                    var body = JSON.parse(error._body);
                    //this.alertMessage = body.message;

                    console.log(error);
                }
            });
    }

    filtrarReservas() {
        this.reservaPorId = [];
        for (var i = 0; i < this.reservas.length; i++) {
            if (this.reservas[i].id_user == this.identity._id) {
                /*console.dir(this.reservas[i].fecha)
                this.reservas[i].fecha.replace(',','-');
                console.log(this.reservas[i].fecha)*/
                //Intenar conseguir el casteo para poder meter la fecha separadas con - y no con ,
                this.reservaPorId.push(this.reservas[i]);
            }
        }
    }

    obtenerUser() {
        this.reservasMod = this.reservas;
        for (var i = 0; i < this.reservasMod.length; i++) {
            this.obtenerNombre(i);
        }
    }
    obtenerNombre(i) {
        this._userService.getUser(this.reservasMod[i].id_user).subscribe(
            response => {
                this.nombreDelUsuario = response.user.email;
                this.reservasMod[i].id_user = this.nombreDelUsuario
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

    obtenerMesa() {
        this.reservasMod = this.reservas;
        for (var i = 0; i < this.reservasMod.length; i++) {
            this.obtenerNumero(i);
        }
    }
    obtenerNumero(i) {
        this._tableService.getTable(this.token, this.reservasMod[i].id_table).subscribe(
            response => {
                this.mesaDelUsuario = response.table.numberTable;
                this.reservasMod[i].id_table = this.mesaDelUsuario;
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

    eliminarReserva(id) {
        console.log(id)
        this._reservedService.deleteReserves(id).subscribe(
            response => {
                console.log(response)
                this.obtenerReservas();
            },
            error => {
                var errorMessage = <any>error;

                if (errorMessage != null) {
                    var body = JSON.parse(error._body); //Filtrar por JSON para obtener aquello que querramos del objeto
                    this.alertMessage = body.message;
                    console.log(this.alertMessage);
                }
            }
        );

    }
}