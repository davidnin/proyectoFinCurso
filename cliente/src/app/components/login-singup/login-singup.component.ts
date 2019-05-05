import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { identity } from 'rxjs';

@Component({
  selector: 'app-login-singup',
  templateUrl: './login-singup.component.html',
  styleUrls: ['./login-singup.component.css'],
  providers: [UserService]
})
export class LoginSingupComponent implements OnInit {
  public title = 'Bienvenidos a la web del chumi churry';
  public user: User;
  public user_register: User;
  public identity;
  public token;
  public errorMessage: string;
  public loginNotGood: string;
  public alertRegister: string;
  public errorRegister: string;
  public usuarioExiste: string;
  public usuarioCreado: string;

  public usuarios: Array<User>;
  constructor(
    private _userService: UserService
  ) {
    this.user = new User('', '', '', '', '', 'ROLE-USER');
    this.user_register = new User('', '', '', '', '', 'ROLE-USER');

  }

  ngOnInit() {
    this.identity = this._userService.getIdentidy();
    this.token = this._userService.getToken();
    this.cargarUsers();
  }

  //Funcion para cuando tengas un error en el login o registro y te vas a la otra pantalla, este error desaparezca
  reiniciarVariables() {
    this.errorMessage = "";
    this.errorRegister = "";
    this.usuarioExiste = "";
    this.loginNotGood = null;
  }

  //Metodo para cargar todos los usuarios y a posteriori, comprobar el email del registro con todos los emails de los users ya 
  //creados
  cargarUsers() {
    this._userService.getUsers().subscribe(
      response => {
        this.usuarios = response.users.undefined
      }
    )
  }

  //Metodo que coje los datos introducidor por el usuario y los cotiza con la bbdd, si son correctos se logea, sino peta
  public iniciarSesion() {
    //Aqui conseguimos los datos del usuario identificado
    this._userService.signup(this.user, true).subscribe(
      response => {
        let identity = response.user;
        this.identity = identity;
        if (!this.identity._id) {
          alert("El usuario no esta correctamente identificado");
        } else {
          localStorage.setItem('identity', JSON.stringify(identity));

          this._userService.signup(this.user, true).subscribe(
            response => {
              let token = response.token;
              this.token = token;
              if (this.token.length <= 1) {
                alert("El token no se ha generado");
              } else {
                localStorage.setItem('token', token);
                this.user = new User('', '', '', '', '', 'ROLE-USER');
                location.href = "";
              }
            },
            error => {
              this.loginNotGood = "Su email o su pasword son incorrectos, por favor, vuelve a introducir estos campos o registrate"
            }
          );
        }
      },
      error => {
        this.loginNotGood = "Su email o su pasword son incorrectos, por favor, vuelve a introducir estos campos o registrate"
      }
    );
  }


//Metodo para cerrar sesion 
  logOut() {
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear();

    this.identity = null;
    this.token = null;
  }

  //Metodo para registrarse, primero comprobaremos que la PK ( en este caso el email) no coincida con ningun otro de ningun user
  // y luego ya pasaremos a cotejar los datos con la bbdd y asi crear el nuevo usuario
  onSubmitRegister() {

    for (var i = 0, length = this.usuarios.length; i < length; i++) {
      if (this.usuarios[i].email == this.user_register.email) {
        this.usuarioExiste = "El registro no se ha podido realizar debido a que el email que a introducido ya existe.";
      }
      console.log("hace el bucle")
    }
    console.log(this.usuarioExiste)
    if (this.usuarioExiste == "") {
      console.log("entraBien")
      if (!this.user_register.email || !this.user_register.name || !this.user_register.lastname || !this.user_register.password) {
        this.errorRegister = "El registro no se ha podido realizar, por favor procede a meter toda la informacion necesaria para darte de alta";
      } else {
        this._userService.register(this.user_register).subscribe(
          response => {
            let user = response.user;
            this.user_register = user;
            this.usuarioCreado = "El registro se ha hecho correctamente, prueba de iniciar sesion con este mail: "+ this.user_register.email;            
            if (!user._id) {
              this.alertRegister = "Error al registrarse";
            } else {
              this.alertRegister = "El registro ha sido correcto, identificate con: " + this.user_register.email;
              this.user_register = new User('', '', '', '', '', 'ROLE-USER');

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
      }

    }
  }
}

