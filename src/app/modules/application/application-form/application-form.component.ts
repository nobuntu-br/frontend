import { AfterViewInit, Component, Injector, OnDestroy, ViewChild, ViewContainerRef } from "@angular/core"; 
import { Application } from "app/modules/application/shared/application.model"; 
import { ApplicationService } from "../shared/application.service"; 
import { ActivatedRoute, Router } from '@angular/router';
import { BaseResourceFormComponent } from "app/shared/components/form/form.component";  
import { FormGeneratorService } from "app/shared/services/form-generator.service";  
import { GeneratedFormFactoryService } from "app/shared/services/generated-form-factory.service";  
import { environment } from "enviroment/environment"; 
import { Subject, takeUntil } from "rxjs"; 

@Component({
  selector: 'app-details-application',
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.scss']
})
export class ApplicationFormComponent extends BaseResourceFormComponent<Application> implements AfterViewInit, OnDestroy { 


  JSONPath : string = environment.ordersJSONPath; 

  @ViewChild('placeToRender', {read: ViewContainerRef}) target!: ViewContainerRef; 
  /** 
   * Subject responsável por remover os observadores que estão rodando na pagina no momento do componente ser deletado. 
   */ 
//  private ngUnsubscribe = new Subject(); 

  constructor(
    protected applicationService: ApplicationService,//Linha alterável com base na classe 
    protected injector: Injector, 
    private generatedFormFactoryService: GeneratedFormFactoryService, 
    private formGeneratorService: FormGeneratorService 
  ) { 
    super(injector, new Application(), applicationService, Application.fromJson);//Linha alterável com base na classe 
    this.buildResourceForm(); 
  } 

  ngAfterViewInit(): void { 
    this.formGeneratorService.getJSONFromDicionario(this.JSONPath).pipe(takeUntil(this.ngUnsubscribe)).subscribe((JSONDictionary: any) => {

      this.localStorageIsEnabled = JSONDictionary.config.localStorage; 
      this.generatedFormFactoryService.getDataToCreateForm(this.JSONPath, JSONDictionary, this.target, ()=>{this.getDataFromAPI()}, this.resourceForm, ()=>{this.submitForm()}, ()=>{this.deleteResource()}, this.currentAction);

    }); 
  } 

  getDataFromAPI() { 
    super.ngOnInit(); 
  } 

  protected buildResourceForm(): void { 
    this.resourceForm = this.formBuilder.group({ 
      id: [null], 
    }); 
  } 

//  ngOnDestroy(): void { 
//    this.ngUnsubscribe.next(null); 
//    this.ngUnsubscribe.complete(); 
//  } 
}
