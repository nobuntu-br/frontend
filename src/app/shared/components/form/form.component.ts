import { OnInit, AfterContentChecked, Injector, Directive, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslocoService } from '@ngneat/transloco';
import { BaseResourceModel } from 'app/shared/models/base-resource.model';
import { LocalStorageFormService } from 'app/shared/services/local-storage-form.service';
import { BaseResourceService } from 'app/shared/services/shared.service';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from "rxjs/operators";

@Directive()
export abstract class BaseResourceFormComponent<T extends BaseResourceModel> implements OnInit, AfterContentChecked, OnDestroy {

  /**
   * Ação atual que o formulário está fazendo, seja alterando algo ou criando.
   * @example "new" ou "edit"
   */
  currentAction: string;
  /**
   * formuário que armazenará os dados.
   */
  resourceForm: FormGroup;
  /**
   * Título da pagina.
   * @example "Caixas"
   */
  pageTitle: string;
  serverErrorMessages: string[] = null;

  submittingForm: boolean = false;
  /**
   * O localStorage será usado para armazenar dados do formulário enquanto estiver sendo preenchido.
   * @example "true" ou "false"
   */
  localStorageIsEnabled: boolean = false;
  /**
   * Indica se os dados do formulário foram alterados
   * @example "true" ou "false"
   */
  formSaved: boolean = false;
  /**
   * Subject responsável por remover os observadores que estão rodando na pagina no momento do componente ser deletado.
   */
  ngUnsubscribe = new Subject();

  protected route: ActivatedRoute;
  protected router: Router;
  protected formBuilder: FormBuilder;
  /**
   * Service que opera as funções de armazenamento de dados do formuário no local storage
   */
  protected localStorageFormService: LocalStorageFormService;
  private translocoService: TranslocoService;

  constructor(
    protected injector: Injector,
    public resource: T,
    protected resourceService: BaseResourceService<T>,
    protected jsonDataToResourceFn: (jsonData) => T,
  ) {
    this.route = this.injector.get(ActivatedRoute);
    this.router = this.injector.get(Router);
    this.formBuilder = this.injector.get(FormBuilder);

    this.localStorageFormService = this.injector.get(LocalStorageFormService);
    this.translocoService = this.injector.get(TranslocoService);
  }

  ngOnInit() {
    this.setCurrentAction();

    if (this.localStorageIsEnabled) {
      this.loadResorceWithLocalStorage();
    } else {
      this.loadResource();
    }

    this.verifyFormValueChanges();

  }

  ngAfterContentChecked() {
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;

    if (this.currentAction == "new")
      this.createResource();
    else // currentAction == "edit"
      this.updateResource();
  }


  // PRIVATE METHODS

  protected setCurrentAction() {
    if (this.route.snapshot.url[0].path == "new")
      this.currentAction = "new"
    else
      this.currentAction = "edit"
  }

  private loadResorceWithLocalStorage() {
    const resourceId = this.route.snapshot.params['id'];
    const className = (this.resource.constructor as any).name;

    const dataStoredInLocalStore = this.localStorageFormService.getDataFromLocalStorage(resourceId, className, this.currentAction);

    if (dataStoredInLocalStore != null) {
      this.resourceForm.patchValue(dataStoredInLocalStore);
    } else {
      this.loadResource();
    }
    this.localStorageFormService.saveInLocalStorageOnEachChange(resourceId, className, this.resourceForm, this.currentAction);
  }

  protected loadResource(): any {
    if (this.currentAction == "edit") {
      this.route.paramMap.pipe(
        switchMap(params => this.resourceService.getById(params.get("id")))
      )
        .subscribe({
          next: (resource) => {
            this.resource = resource;
            //TODO usar transloco nessas mensagens
            if (this.resourceForm == null) { console.error("ResourceForm não foi instanciado") }
            this.resourceForm.addControl("updatedAt", this.formBuilder.control(null));
            this.resourceForm.patchValue(resource); // binds loaded resource data to resourceForm
          },
          error: (error) => alert(this.translocoService.translate("componentsBase.Alerts.readErrorMessage"))
        })
    }
  }


  protected setPageTitle() {
    if (this.currentAction == 'new')
      this.pageTitle = this.creationPageTitle();
    else {
      this.pageTitle = this.editionPageTitle();
    }
  }

  protected creationPageTitle(): string {
    return "Novo"
  }

  protected editionPageTitle(): string {
    return "Edição"
  }

  protected createResource() {
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);

    this.resourceService.create(resource).subscribe({
      next: (response) => {
        this.actionsForSuccess(response);
        const className = (this.resource.constructor as any).name;
        this.localStorageFormService.remove("new"+className);
      },
      error: (error) => this.actionsForError(error)
    });
  }

  protected updateResource() {
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);

    this.resourceService.update(resource.id, resource).subscribe({
      next: (response) => this.actionsForSuccess(response),
      error: (error) => this.actionsForError(error)
    });
  }

  protected deleteResource() {
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);

    this.resourceService.delete(resource.id).subscribe({
      next: (response) => this.actionsForSuccess(response),
      error: (error) => this.actionsForError(error)
    });
  }

  protected actionsForSuccess(resource: T) {
    const baseComponentPath: string = this.route.snapshot.parent.url[0].path;

    alert(this.translocoService.translate("componentsBase.Alerts.defaultSuccessMessage"));

    // redirect/reload component page
    this.router.navigateByUrl(baseComponentPath, { skipLocationChange: false }).then(
      // () => this.router.navigate([baseComponentPath, resource.id, "edit"]) //Nesse caso, ao criar ou editar ele ficará na mesma pagina
      () => this.router.navigate([baseComponentPath])
    )
  }

  protected actionsForError(error) {

    this.submittingForm = false;
    alert(this.translocoService.translate("componentsBase.Alerts.defaultErrorMessage"));

    if (error.status === 422)
      this.serverErrorMessages = JSON.parse(error._body).errors;
    else
      this.serverErrorMessages = ["Falha na comunicação com o servidor. Por favor, tente mais tarde."]
  }

  protected abstract buildResourceForm(): void;

  protected verifyFormValueChanges(){
    this.resourceForm.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next:(data) => this.formSaved = false, 
    });
  }

  returnFormFunction(){
    this.alertToReturn();
    
  }

  alertToReturn(){
    if(this.formSaved == true) return;

    alert(this.translocoService.translate("componentsBase.Alerts.rememberToSave"));
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}