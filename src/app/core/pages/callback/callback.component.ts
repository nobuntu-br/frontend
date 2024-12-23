import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss']
})
export class CallbackComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ){
    
  }

  ngOnInit(): void {
    const accessToken = this.getAccessTokenOnRouteQueryParams();

    this.checkUserHasPermissionOnApplication(accessToken);
  }

  getAccessTokenOnRouteQueryParams(): string | null {
    // Obter query params (parâmetros de consulta, como ?search=value)
    this.route.queryParams.pipe(take(1)).subscribe(queryParams => {
      console.log('Query Params:', queryParams);
      if(queryParams.key === "accessToken"){
        return queryParams.value as string;
      }
    });

    return null;
  }

  checkUserHasPermissionOnApplication(accessToken: string){
    //TODO check acess token. faz requisição para API
      //TODO ter rota que ao mandar o token de acesso ele passa os dados do usuário

    //TODO save acessToken on localstorage

  }

  redirectToApplication(){
    this.router.navigate(['/home']);
  }

  redirectToErrorPage(){
    this.router.navigate(['/error-505']);
  }

}
