import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { ReservedService } from 'src/app/services/reserved.service';
import { Reserved } from 'src/app/models/reserved';
import { identity } from 'rxjs';

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

    public reservas: Reserved[];
    public undefined: Reserved[];
    public reservaPorId: Reserved[];

    constructor(
        private _userService: UserService,
        private _reservedService: ReservedService
    ) {
        this.titulo = "Actualizar los datos"
        //Aqui abajo se interactua con las sesiones del user locaStorage
        this.identity = this._userService.getIdentidy();
        this.token = this._userService.getToken();
        this.user = this.identity;

    }

    ngOnInit() {
        console.log("user-edit-component-ts cargado");
        this.obtenerReservas();
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
}