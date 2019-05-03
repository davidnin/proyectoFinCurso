import { Component, OnInit } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-carta',
  templateUrl: './carta.component.html',
  styleUrls: ['./carta.component.css']
})
export class CartaComponent implements OnInit {

  constructor() { }
  //Metodo para destapar/esconder la carta especifica de aquello que haya clickado el usuario
  ngOnInit() {
    $(document).ready(function () {
      $('.panel-heading').click(function () {
        var $this = $(this);
        if ($this.hasClass('panel-collapsed')) {
          $this.parents('.panel').find('.panel-body').slideUp();
          $this.removeClass('panel-collapsed');
          $this.find('i').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');

        } else {
          $this.parents('.panel').find('.panel-body').slideDown();
          $this.addClass('panel-collapsed');
          $this.find('i').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');

        }
      })
    })
  }

}
