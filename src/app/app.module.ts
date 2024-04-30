import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { AppComponent } from './app.component';
import { MAT_DATE_LOCALE } from '@angular/material/core'; 
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router'; 
import { CoreModule } from 'app/core/core.module'; 
import { appRoutes } from './app-routing.module'; 
import { NgxMaskModule, IConfig } from 'ngx-mask'; 
import { TranslocoRootModule } from './transloco-root.module';

import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';


export const options: Partial<null|IConfig> | (() => Partial<IConfig>) = null; 

const routerConfig: ExtraOptions = { 
    preloadingStrategy       : PreloadAllModules, 
    scrollPositionRestoration: 'enabled' 
}; 

@NgModule({ 
  declarations: [ 
    AppComponent, 
  ],
  imports: [ 
    BrowserModule, 
        BrowserAnimationsModule, 
        RouterModule.forRoot(appRoutes, routerConfig), 
        NgxMaskModule.forRoot(), 
        CoreModule, 
        HttpClientModule, 
    TranslocoRootModule,
    SharedModule
  ], 
  providers: [ 
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, 
  ], 
  bootstrap: [AppComponent] 
}) 
export class AppModule { } 
