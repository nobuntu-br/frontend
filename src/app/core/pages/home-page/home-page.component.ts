import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {

  constructor(
    private router: Router,
  ){}

  goToSignInPage(){
    this.router.navigate(['signin']);
  }

  goToSignUpPage(){
    this.router.navigate(['signup']);
  }
}
