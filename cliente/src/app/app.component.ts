import { Component, OnInit, DoCheck } from '@angular/core';
import { UserService } from './services/user.service';
import { User } from './models/user';
import { identity } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent implements DoCheck {
  public identity;
  public token;

  constructor(
    private _userService: UserService
  ) {}

  ngDoCheck() {
    this.identity = this._userService. getIdentidy();
    this.token = this._userService.getToken();

  }
}

