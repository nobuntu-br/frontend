import { Route } from '@angular/router'; 
import { AuthGuard } from 'app/core/auth/guards/auth.guard'; 
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard'; 
import { SideNavComponent } from './shared/components/side-nav/side-nav.component'; 
import { EditProfileComponent } from './shared/components/edit-profile/edit-profile.component';
import { ResetPasswordComponent } from './shared/components/reset-password/reset-password.component';
import { CreateUserComponent } from './shared/components/create-user/create-user.component'; 
import { SigninComponent } from './core/pages/signin/signin.component';


export const appRoutes: Route[] = [ 

    // Redirect empty path to '/example' 
    {path: 'signin', pathMatch: 'full', component: SigninComponent}, 

    {path: 'createuser', pathMatch: 'full', component: CreateUserComponent}, 
    {path: 'resetPassword', pathMatch: 'full', component: ResetPasswordComponent}, 
    // Auth routes for guests 
        {path: 'signin', loadChildren: () => import('app/core/pages/signin/signin.module').then(m => m.SigninModule)},
        {path: '404-not-found', loadChildren: () => import('app/core/pages/error/error-404/error-404.module').then(m => m.Error404Module)}, 

                    {path: '500', loadChildren: () => import('app/core/pages/error/error-500/error-500.module').then(m => m.Error500Module)}, 

    // Admin routes 
    { 
        path: '', 
        canMatch: [AuthGuard], 
        component: SideNavComponent, 
        children: [ 
	{ path: 'empreendimentos', loadChildren: () => import('./modules/empreendimento/empreendimento.module' ).then(m => m.EmpreendimentoModule) },
	{ path: 'estabelecimentos', loadChildren: () => import('./modules/estabelecimento/estabelecimento.module' ).then(m => m.EstabelecimentoModule) },
	{ path: 'areas-de-negocio', loadChildren: () => import('./modules/area-de-negocio/area-de-negocio.module' ).then(m => m.AreaDeNegocioModule) },
	{ path: 'plano-de-contas', loadChildren: () => import('./modules/plano-de-contas/plano-de-contas.module' ).then(m => m.PlanoDeContasModule) },
	{ path: 'centros-de-custos', loadChildren: () => import('./modules/centro-de-custo/centro-de-custo.module' ).then(m => m.CentroDeCustoModule) },
	{ path: 'projetos', loadChildren: () => import('./modules/projeto/projeto.module' ).then(m => m.ProjetoModule) },
	{ path: 'historicos-padrao', loadChildren: () => import('./modules/historico-padrao/historico-padrao.module' ).then(m => m.HistoricoPadraoModule) },
	{ path: 'planilha-de-orcamento', loadChildren: () => import('./modules/planilha-do-orcamento/planilha-do-orcamento.module' ).then(m => m.PlanilhaDoOrcamentoModule) },
	{ path: 'estrutura-orcamento', loadChildren: () => import('./modules/estrutura-do-orcamento/estrutura-do-orcamento.module' ).then(m => m.EstruturaDoOrcamentoModule) },
	{ path: 'funcoes-de-previsao', loadChildren: () => import('./modules/funcao-de-previsao/funcao-de-previsao.module' ).then(m => m.FuncaoDePrevisaoModule) },
	{ path: 'indicadores', loadChildren: () => import('./modules/indicador/indicador.module' ).then(m => m.IndicadorModule) },
	{ path: 'registros-de-indicadores', loadChildren: () => import('./modules/registro-de-indicador/registro-de-indicador.module' ).then(m => m.RegistroDeIndicadorModule) },
	{ path: 'lancamentos-contabeis', loadChildren: () => import('./modules/lancamento-contabil/lancamento-contabil.module' ).then(m => m.LancamentoContabilModule) },
	{ path: 'partida-do-lancamento', loadChildren: () => import('./modules/partida-do-lancamento/partida-do-lancamento.module' ).then(m => m.PartidaDoLancamentoModule) },
	{ path: 'usuarios-do-estabelecimento', loadChildren: () => import('./modules/usuario-do-estabelecimento/usuario-do-estabelecimento.module' ).then(m => m.UsuarioDoEstabelecimentoModule) },
	{ path: 'tabela-moedas', loadChildren: () => import('./modules/tabela-moeda/tabela-moeda.module' ).then(m => m.TabelaMoedaModule) },
	{ path: 'cotacao-moeda', loadChildren: () => import('./modules/cotacao-moeda/cotacao-moeda.module' ).then(m => m.CotacaoMoedaModule) },
          {path: 'editProfile', pathMatch: 'full', component: EditProfileComponent},  
        //   {path: '**', redirectTo: '/404-not-found'}, 
        ] 
    }, 
]; 
