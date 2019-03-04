import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { identity } from 'rxjs';

@Component({
  selector: 'app-nav-bar-login',
  templateUrl: './nav-bar-login.component.html',
  styleUrls: ['./nav-bar-login.component.css']
})
export class NavBarLoginComponent implements OnInit {
  public identity;
  public token;

  constructor(
    private _userService: UserService
  ) {}

  ngOnInit() {
    this.identity = this._userService. getIdentidy();
    this.token = this._userService.getToken();

    console.log(identity);
  }

  logOut(){
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear();

    this.identity=null;
    this.token=null;
  }
}
