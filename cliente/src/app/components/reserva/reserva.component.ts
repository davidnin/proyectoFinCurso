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
  public undefined: Reserved[];

  public reservaPorFecha: Reserved[] = [];


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
    this.fechafinal = this.fechaReal.replace('"', "");

    var radios = document.getElementsByName('optionsRadios');
    for (var i = 0, length = radios.length; i < length; i++) {
      if (radios[i].checked) {
        // do whatever you want with the checked radio
        this.turno = radios[i].value;
        // only one radio can be log  ically checked, don't check the rest
        break;
      }
    }
    console.log(this.fechafinal)
    console.log(this.turno)
    //si el usuario no mete ninguna fecha, se le assiganara el dia actual automaticamente
    //toca hacer mejor la comprobacion para que salga por visual no por alert, cuando aplique estilos ya se hara
    if (!this.turno) {
      alert("No has seleccionado un turno correctamente, si quieres cercar, pon un turno valido");
    }
    this.buscarReserva()
  }


  buscarReserva() {
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
    this.reservaPorFecha = [];
    for (var i = 0; i < this.reservas.length; i++) {
      if (this.reservas[i].fecha == this.fechafinal) {
        if (this.turno == "Turno1" && this.reservas[i].turno1) {
          this.reservaPorFecha.push(this.reservas[i]);
        }
        if (this.turno == "Turno2" && this.reservas[i].turno2) {
          this.reservaPorFecha.push(this.reservas[i]);
        }
        if (this.turno == "Turno3" && this.reservas[i].turno3) {
          this.reservaPorFecha.push(this.reservas[i]);
        }
        if (this.turno == "Turno4" && this.reservas[i].turno4) {
          this.reservaPorFecha.push(this.reservas[i]);
        }
      }
    }

    this.mostrarDisponibilidad();
  }

  mostrarDisponibilidad() {
    var aux: boolean = false;
    console.log(this.reservaPorFecha)
    for (var x = 0; x < this.mesas.length; x++) {
      for (var z = 0; z < this.reservaPorFecha.length; z++) {
        if (this.mesas[x]._id == this.reservaPorFecha[z].id_table) {
          console.log(this.mesas[x])
          console.log("entra en assignar mesa ocupada")
          aux = true;
          this.mesas[x].ocupada = true;
          console.log(this.mesas[x])
        } else {
          //this.mesas[x].ocupada = false;
        }
      }
      console.log(aux)
      console.log(this.reservaPorFecha)
      if (aux) {

      } else {
        this.mesas[x].ocupada = false;
      }
      console.log(this.mesas)
    }
  }

  Abrirreservar(elemento) {
    this.abrirReserva = "true";
    this.id_table = elemento;
    this.crearreserva.id_table = elemento;
    this.crearreserva.id_user = this.identity._id;
  }

  onSubmit() {
    console.log(this.crearreserva.people)
    var aux2: any;
    for (var s = 0; s < this.mesas.length; s++) {
      if (this.mesas[s]._id == this.crearreserva.id_table) {
        aux2 = this.mesas[s];
      }
    }
    if (this.crearreserva.people > aux2.maxPersons) {
      alert("El numero de personas sobrepasa el limite de personas de la mesa escojida, por favor , escoja otra mesa mas grande")
    } else {
      this.crearreserva.fecha = this.fechafinal;
      if (this.turno == "Turno1") {
        this.crearreserva.turno1 = true;
      } else if (this.turno == "Turno2") {
        this.crearreserva.turno2 = true;
      } else if (this.turno == "Turno3") {
        this.crearreserva.turno3 = true;
      } else if (this.turno == "Turno4") {
        this.crearreserva.turno4 = true;
      }

      console.log(this.crearreserva);

      this._reservedService.createReserve(this.crearreserva).subscribe(
        response => {
          alert("La reserva se ha creado correctamente")
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
