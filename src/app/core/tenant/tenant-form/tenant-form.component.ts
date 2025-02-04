import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-tenant-form',
  templateUrl: './tenant-form.component.html',
  styleUrls: ['./tenant-form.component.scss']
})
export class TenantFormComponent {

  databaseCredentialFormGroup: FormGroup = this._formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
  });

  constructor(
    private _formBuilder: FormBuilder,
  ) { }
}
