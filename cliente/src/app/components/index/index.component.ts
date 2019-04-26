import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  public identity;

  constructor(
    private _userService: UserService
  ) { }

  ngOnInit() {
    this.identity = this._userService.getIdentidy();
    
  }

}
