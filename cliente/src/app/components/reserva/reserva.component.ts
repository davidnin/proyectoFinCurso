import { Component, OnInit } from '@angular/core';
import { table } from '../../models/table';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { TableService } from 'src/app/services/table.service';
import { UserService } from 'src/app/services/user.service';
import { ReservedService } from 'src/app/services/reserved.service';
import { GLOBAL } from 'src/app/services/global';
import { Reserved } from 'src/app/models/reserved';
import { AboutUsComponent } from '../about-us/about-us.component';

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.css']
})
export class ReservaComponent implements OnInit {

  public mesas: table[];

  public identity;
  public token;
  public url: string;

  public abrirReserva: string = "";
  public crearreserva: Reserved;

  public alertMessage;
  public alertRegister: any;

  public id_table: any;

  public fecha: any;
  public fechaReal: any;
  public turno: any;
  public diaModificado: any;
  public fechafinal: any;
  public reservas: Reserved[];


  public tablaModificada: table;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _tableService: TableService,
    private _reservedService: ReservedService
  ) {
    this.crearreserva = new Reserved('', '', '', false, false, false, false, '');
    this.identity = this._userService.getIdentidy();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
  }

  ngOnInit() {
    console.log("reserva componente ejecutado correctamente");

    this.getMesas();
  }


  buscarReserva() {
    console.log(this.fechafinal)
    this._reservedService.getReserves().subscribe(
      response => {
        console.log(response.reserveds)
        if(!response.reserveds){
          this.alertMessage = 'Este album no tiene canciones';
        }else{
          this.reservas = response.reserveds;
          console.log(this.reservas)

        }
      },
      error => {
        var errorMessage = <any>error;

            if(errorMessage != null){
              var body = JSON.parse(error._body);
              //this.alertMessage = body.message;

              console.log(error);
            }
      });

  } 

  getMesas() {

    this._route.params.forEach((params: Params) => {

      this._tableService.getTables(this.token).subscribe(
        response => {
          if (!response.tables.undefined) {
            this.alertMessage = "Error a la hora de cargar las tablas. Por favor, dejenos constancia de ello enviando un correo a nuestra cuenta ···· "
          } else {
            this.mesas = response.tables.undefined;
          }
        },
        error => {
          var errorMessage = <any>error;

          if (errorMessage != null) {
            var body = JSON.parse(error._body);
            //this.alertMessage = body.message;

            console.log(error);
          }
        })
    });
  }


  submitForm() {

    this.fecha = localStorage.getItem('fecha');
    this.fecha = this.fecha.replace("T", " ");
    this.fechaReal = this.fecha.split(" ", 1);
    this.diaModificado = this.fechaReal[0].split("-", 4);
    this.diaModificado[2]++;
    this.fechaReal = this.diaModificado.toString();
    this.fechafinal = this.fechaReal.replace('"',"");

    var radios = document.getElementsByName('optionsRadios');
    for (var i = 0, length = radios.length; i < length; i++) {
      if (radios[i].checked) {
        // do whatever you want with the checked radio
        this.turno = radios[i].value;
        // only one radio can be log  ically checked, don't check the rest
        break;
      }
    }

    this.buscarReserva()
  }

  Abrirreservar(elemento) {
    this.abrirReserva = "true";
    this.id_table = elemento;
    this.crearreserva.id_table = elemento;
    this.crearreserva.id_user = this.identity._id;
  }

  /*
    onSubmit() {
      this._reservedService.createReserve(this.crearreserva).subscribe(
        response => {
          let reserva = response;
          this.crearreserva = reserva;
  
          if (!reserva.date) {
            this.alertRegister = "Error al crear la reserva";
          } else {
            this.alertRegister = "La reserva se ha creado correctamente, si quiere modificar-la , vaya a su perfil ";
            this.crearreserva = new Reserved('', '', '', '');
  
          }
        },
        error => {
          var errorMessage = <any>error;
  
          if (errorMessage != null) {
            var body = JSON.parse(error._body); //Filtrar por JSON para obtener aquello que querramos del objeto
            this.alertRegister = body.message;
          }
        }
      );
      this._tableService.getTable(this.token, this.id_table).subscribe(
        response => {
          if (!response.table) {
            this.alertMessage = "Error a la hora de cargar las tablas. Por favor, dejenos constancia de ello enviando un correo a nuestra cuenta ···· "
          } else {
            this.tablaModificada = response.table;
            if (this.tablaModificada.ocupada == false) {
              this.tablaModificada.ocupada = true;
              this._tableService.editTable(this.token, this.id_table, this.tablaModificada).subscribe(
                response => {
                    console.log("todo ok");
                    this.getMesas();
                },
                error => {
                  var errorMessage = <any>error;
          
                  if (errorMessage != null) {
                    var body = JSON.parse(error._body); //Filtrar por JSON para obtener aquello que querramos del objeto
                    this.alertRegister = body.message;
                  }
                  console.log(this.alertRegister);
                }
              );
            }
          }
        },
        error => {
          var errorMessage = <any>error;
  
          if (errorMessage != null) {
            var body = JSON.parse(error._body);
            //this.alertMessage = body.message;
  
            console.log(error);
          }
        })
    }*/
}

