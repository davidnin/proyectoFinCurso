import { Component, OnInit } from '@angular/core';
import { table } from '../../models/table';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { TableService } from 'src/app/services/table.service';
import { UserService } from 'src/app/services/user.service';
import { ReservedService } from 'src/app/services/reserved.service';
import { GLOBAL } from 'src/app/services/global';
import { Reserved } from 'src/app/models/reserved';
declare var $: any;
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

  public alertMessage: boolean = false;
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

  public mesasPrimeraFila: table[] = [];
  public mesasSegundaFila: table[] = [];
  public mesasTerceraFila: table[] = [];
  public buscando: boolean = false;

  public mesaNueva: table;
  public esAdmin: boolean = false;
  public mesaCreada: boolean = false;

  public errorCrearReserva;

  public reservaCreada;
  public mesaEstaBienCreada;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _tableService: TableService,
    private _reservedService: ReservedService
  ) {
    this.crearreserva = new Reserved('', '', '', false, false, false, false, '');
    this.mesaNueva = new table('', 0, 0, false);
    this.identity = this._userService.getIdentidy();
    //console.log(this.identity)
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
  }

  ngOnInit() {
    this.cargarCalendario()
  }
  //Funcion para cargar el datepicker sin necesidad de recargar pagina
  cargarCalendario() {
    var dateToday = new Date();
    $(function () {
      $("#datepicker").datepicker({
        numberOfMonths: 1, showButtonPanel: true, minDate: dateToday, closeText: 'Cerrar',
        prevText: '< Ant',
        nextText: 'Sig >',
        currentText: 'Hoy',
        monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Juv', 'Vie', 'Sáb'],
        dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
        weekHeader: 'Sm',
        dateFormat: 'dd/mm/yy',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ''
      });
      $("#datepicker").datepicker("option", "dateFormat", "yy-mm-dd");
      $("#datepicker").datepicker("option", "showAnim", "slideDown");
      $('[type="text"]').change(function () {
        var date = $(this).datepicker("getDate");
        console.log("Funcionde script: " + date);
        localStorage.setItem('fecha', JSON.stringify(date));
      });
    });
  }

  //Funcion para obtener todas las mesas y utilizar este array mas adelante
  getMesas() {

    this._route.params.forEach((params: Params) => {

      this._tableService.getTables(this.token).subscribe(

        response => {
          if (!response.tables.undefined) {
            this.alertMessage = true;
          } else {
            this.mesas = response.tables.undefined;
            //console.log(this.mesas)
            this.mapeoMesas();
          }
        },
        error => {
          var errorMessage = <any>error;

          if (errorMessage != null) {
            var body = JSON.parse(error._body);
            //this.alertMessage = body.message;

            //console.log(error);
          }
        })
    });
  }

  //LLegamos a la parte tocho, la parte del codigo la cual se lanza cuando el usuario hace una reserva
  reserva() {
    this.abrirReserva = "";
    this.fecha = localStorage.getItem('fecha');
    this.fecha = this.fecha.replace("T", " ");
    this.fechaReal = this.fecha.split(" ", 1);
    this.diaModificado = this.fechaReal[0].split("-", 4);
    this.diaModificado[2]++;
    this.fechaReal = this.diaModificado.toString();
    this.fechafinal = this.fechaReal.replace('"', "");
    //Hasta aqui parseamos la informacion del datepicker para convertirla en un string con dia-mes-año
    var radios = document.getElementsByName('optionsRadios');

    //si el usuario no mete ninguna fecha, se le assiganara el dia actual automaticamente
    for (var i = 0, length = radios.length; i < length; i++) {
      if (radios[i].checked) {
        this.turno = radios[i].value;
        break;
      }
    }
    if (!this.turno) {
      this.alertMessage = true;
    } else {
      if (!this.buscando) {
        this.alertMessage = false;
        this.getMesas()
        this.buscando = true;
        this.buscarReserva()
      }
    }
  }

  //Del array de mesas , divide este en 3 arrays, que seran los arrays que se recorreran en la vista para mostrar el mapa de mesas
  mapeoMesas() {
    for (var i = 0, length = this.mesas.length; i < length; i++) {
      if (this.mesas[i].maxPersons == 2 || this.mesas[i].maxPersons == 8) {
        this.mesasPrimeraFila.push(this.mesas[i]);
      }
      if (this.mesas[i].maxPersons >= 10) {
        this.mesasSegundaFila.push(this.mesas[i]);
      }
      if (this.mesas[i].maxPersons == 4 || this.mesas[i].maxPersons == 6) {
        this.mesasTerceraFila.push(this.mesas[i]);
      }
    }
    if (this.identity.role == "ROLE-ADMIN") {
      this.esAdmin = true;
    }
  }

  //Esta funcion de aqui lo que hace es pedir a la api todas las reservas del restaurante
  buscarReserva() {
    this._reservedService.getReserves().subscribe(
      response => {
        if (!response.reserveds) {
          this.alertMessage = true;
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

          //console.log(error);
        }
      });
  }

  //Esta de aqui lo que hace es filtrar las reservas por el turno que esten reservadas.
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


  //Este metodo de aqui lo que hace es una funcuin muy simple, una vez tenemos el dia y el turno cotejado, busca por este dia y
  //este turrno y lo que hace a partir de aqui es comparar el turno y el id de mesa para saber si esta disponible o esa mesa en ese
  //turno ya esta reservada y por lo tanto no esta disponible
  mostrarDisponibilidad() {
    var aux: boolean = false;
    for (var x = 0; x < this.mesas.length; x++) {
      for (var z = 0; z < this.reservaPorFecha.length; z++) {
        if (this.mesas[x]._id == this.reservaPorFecha[z].id_table) {
          aux = true;
          this.mesas[x].ocupada = true;
        }
      }
      if (!aux) {
        this.mesas[x].ocupada = false;
      }
    }
  }

  Abrirreservar(elemento) {
    this.abrirReserva = "true";
    this.id_table = elemento;
    this.crearreserva.id_table = elemento;
    this.crearreserva.id_user = this.identity._id;
  }
  //Metodo para crear la reserva
  onSubmit() {
    //console.log(this.crearreserva.people)
    var aux2: any;
    for (var s = 0; s < this.mesas.length; s++) {
      if (this.mesas[s]._id == this.crearreserva.id_table) {
        aux2 = this.mesas[s];
      }
    }
    if (this.crearreserva.people > aux2.maxPersons) {
      this.errorCrearReserva = "El numero de personas sobrepasa el limite de personas de la mesa escojida, por favor , escoja otra mesa mas grande";
    } else if ((this.crearreserva.people - 1) < aux2.maxPersons - 2) {
      this.errorCrearReserva = "El numero de personas es mas pequeño que  el limite de personas de la mesa escojida, por favor , escoja otra mesa mas pequeña";
    } else {
      this.errorCrearReserva = null;
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

      //console.log(this.crearreserva);

      this._reservedService.createReserve(this.crearreserva).subscribe(
        response => {
          this.reservaCreada = "La reserva se ha creado correctamente";
        },
        error => {
          var errorMessage = <any>error;

          if (errorMessage != null) {
            var body = JSON.parse(error._body); //Filtrar por JSON para obtener aquello que querramos del objeto
            this.alertMessage = body.message;
            //console.log(this.alertMessage);
          }
        }
      )
    }
  }


  //Funcion solo para el administrador del lugar web la cual te deja añadir una mesa
  crearMesa() {
    this.mesaNueva.ocupada = false;
    var x = this.mesas.length + 1;
    console.log(x);
    this.mesaNueva._id = String(x);
    //console.log(this.mesaNueva);
    this._tableService.createTable(this.mesaNueva).subscribe(
      response => {
        this.mesaEstaBienCreada = "La reserva se ha creado correctamente";
        this.buscando = false;
        this.mesas = [];
        this.mesasPrimeraFila = [];
        this.mesasSegundaFila = [];
        this.mesasTerceraFila = [];
      },
      error => {
        var errorMessage = <any>error;

        if (errorMessage != null) {
          var body = JSON.parse(error._body); //Filtrar por JSON para obtener aquello que querramos del objeto
          this.alertMessage = body.message;
          //console.log(this.alertMessage);
        }
      }
    )
  }
}
