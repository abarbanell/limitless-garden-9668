import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedin = false;
  userName = "not logged in";

  constructor(
    private _authService: AuthService, 
    private _router: Router
  ) { 
 
  }

  ngOnInit() {
    this._authService.initialized.subscribe(s => {
      this.isLoggedin = s;
      this.userName = this._authService.user.displayName;
   })
  }
}