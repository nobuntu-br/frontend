import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { AppComponent } from './app.component';
import { MAT_DATE_LOCALE } from '@angular/material/core'; 
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router'; 
import { CoreModule } from 'app/core/core.module'; 
import { appRoutes } from './app-routing.module';
import { NgxMaskModule, IConfig } from 'ngx-mask'; 

import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { TranslocoRootModule } from './transloco-root.module';


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
        TranslocoRootModule,
        HttpClientModule, 
    SharedModule
  ], 
    bootstrap   : [ 
        AppComponent 
    ], 
  providers: [ 
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, 
  ], 
}) 
export class AppModule { } 
