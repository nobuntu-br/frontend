import { query } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Host, HostListener, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DashboardField } from 'app/shared/models/dashboard-field';
import { ICharOptions } from 'app/shared/models/dashboardStructure';
import { DinamicDashboardFieldFactory } from 'app/shared/models/dinamic-dashboard-factory';
import { DashboardFactoryService } from 'app/shared/services/dashboard-factory.service';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

export interface ICardOptions {
  name: string;
  value: any;
}

export interface IDashboardOptions {
  card?: ICardOptions;
  type: string;
  title: string;
  typeOfData: string;
  apiUrl: string;
  colorSchema: string;
  animations: boolean;
  legendTitle: string;
  legendPosition: string;
  hideZeroValues: boolean;
  dataLabels: boolean;
  gridLines: boolean;
  xAxisLabel: string;
  yAxisLabel: string;
}

@Component({
  selector: 'app-default-dashboard',
  templateUrl: './default-dashboard.component.html',
  styleUrls: ['./default-dashboard.component.scss']
})
export class DefaultDashboardComponent implements AfterViewInit {

  @ViewChild('placeToRender', { read: ViewContainerRef }) target!: ViewContainerRef; 


  constructor(
    private dashboardFactory: DashboardFactoryService,
    private route: ActivatedRoute) {
  }

  ngAfterViewInit() {
    this.getDashboard();
  }

  getDashboard() {
    let idDashboard = this.route.snapshot.url[1].path;
    let jsonDashboard = `../../../../assets/dicionario/dashboard/${idDashboard}.json`;
    
    this.dashboardFactory.createDashboard(this.target, jsonDashboard);
  }
}
