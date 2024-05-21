import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  constructor(private authService: AuthService) {

  }
  ngOnInit(): void {
    //Redireciona o usuário para pagina de singIn da Azure
    this.authService.login();
  }
}
