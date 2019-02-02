import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { User } from './models/user';
import { identity } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent implements OnInit {
  public title = 'Bienvenidos a la web del chumi churry';
  public user: User;
  public user_register: User;
  public identity;
  public token;
  public errorMessage;
  public alertRegister;


  constructor(
    private _userService: UserService
  ) {
    this.user = new User('', '', '', '', '', 'ROLE_USER', '');
    this.user_register = new User('', '', '', '', '', 'ROLE_USER', '');

  }

  ngOnInit() {
    this.identity = this._userService. getIdentidy();
    this.token = this._userService.getToken();

    console.log(identity);
    console.log(this.token);
  }


  public onSubmit() {
    console.log(this.user);
    //Aqui conseguimos los datos del usuario identificado
    this._userService.signup(this.user, true).subscribe(
      response => {
        let identity = response.user;
        this.identity = identity;
        console.log(this.identity);
        if (!this.identity._id) {
          alert("El usuario no esta correctamente identificado");
        } else {
          localStorage.setItem('identity', JSON.stringify(identity));

          this._userService.signup(this.user, true).subscribe(
            response => {
              console.log(response);
              let token = response.token;
              this.token = token;

              if (this.token.length <= 1) {
                alert("El token no se ha generado");
              } else {
                localStorage.setItem('token', token);
                this.user = new User('', '', '', '', '', 'ROLE_USER', '');

              }
            },
            error => {
              var errorMessage = <any>error;

              if (errorMessage != null) {
                var body = JSON.parse(error._body); //Filtrar por JSON para obtener aquello que querramos del objeto
                this.errorMessage = body.message;
                console.log(errorMessage);
              }
            }
          );
        }
      },
      error => {
        var errorMessage = <any>error;

        if (errorMessage != null) {
          var body = JSON.parse(error._body); //Filtrar por JSON para obtener aquello que querramos del objeto
          this.errorMessage = body.message;
          console.log(errorMessage);
        }
      }
    );
  }

  
  logOut(){
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear();

    this.identity=null;
    this.token=null;
  }

  onSubmitRegister(){
    this._userService.register(this.user_register).subscribe(
      response => {
        console.log(this.user_register);
        let user = response.user;
        this.user_register = user;

        if(!user._id){
          this.alertRegister = "Error al registrarse";
        }else{
          this.alertRegister = "El registro ha sido correcto, identificate con: "+ this.user_register.email;
          this.user_register =  new User('', '', '', '', '', 'ROLE_USER', '');
          
        }
      },
      error => {
        var errorMessage = <any>error;

        if (errorMessage != null) {
          var body = JSON.parse(error._body); //Filtrar por JSON para obtener aquello que querramos del objeto
          this.alertRegister = body.message;
          console.log(errorMessage);
        }
      }
    );
  }

}

