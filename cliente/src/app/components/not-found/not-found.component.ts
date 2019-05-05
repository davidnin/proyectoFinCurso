import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {

  constructor(private location: Location) { }

  ngOnInit() {
  }

  onclick(){
    this.location.back(); //Funcion en la cual clickando al boton de volver atras vuelve a la pagina anterior
  } 
}
