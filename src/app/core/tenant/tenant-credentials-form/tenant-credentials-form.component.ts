import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-tenant-credentials-form',
  templateUrl: './tenant-credentials-form.component.html',
  styleUrls: ['./tenant-credentials-form.component.scss']
})
export class TenantCredentialsFormComponent {

  constructor(private dialogRef: MatDialogRef<TenantCredentialsFormComponent>) { }

  cancel(): void {
    this.dialogRef.close();
  }

}
