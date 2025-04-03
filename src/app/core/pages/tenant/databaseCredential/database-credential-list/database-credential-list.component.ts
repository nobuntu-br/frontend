import { Component } from '@angular/core';
import { DatabaseCredential, IDatabaseCredential } from '../databaseCredential.model';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DatabaseCredentialService } from '../databaseCredential.service';
import { take } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-database-credential-list',
  templateUrl: './database-credential-list.component.html',
  styleUrls: ['./database-credential-list.component.scss']
})
export class DatabaseCredentialListComponent {
  displayedColumns: string[] = ['checkbox', 'id', 'edit'];

  /**
   * Controladores de dados da tabela
   */
  dataSource = new MatTableDataSource<IDatabaseCredential>();
  selection = new SelectionModel<IDatabaseCredential>(true, []);

  tenantId: number;

  databaseCredentials: DatabaseCredential[] = [];

  nameSearchForm: FormControl = new FormControl<string>("");

  constructor(
    public dialog: MatDialog,
    private databaseCredentialService: DatabaseCredentialService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.getTenantIdByRouteParam();

    this.getDatabaseCretentials(this.tenantId);

  }

  getTenantIdByRouteParam() {
    //Pegar o ID do tenant da rota
    this.route.paramMap.pipe(take(1)).subscribe(params => {
      this.tenantId = Number(params.get('id'));
    });
  }

  async getDatabaseCretentials(tenantId: number) {

    this.databaseCredentialService.getByTenantId(tenantId).pipe(take(1)).subscribe({
      next: (databaseCredentials: DatabaseCredential[]) => {
        this.databaseCredentials = databaseCredentials;
        console.log(databaseCredentials);
        this.dataSource.data = this.databaseCredentials;
      },
    });

  }

  getDatabaseCredentialsByName(){

    this.databaseCredentialService.getByTenantId
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.databaseCredentials.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.databaseCredentials);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: IDatabaseCredential): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'}`;
  }

  goToCreateNewDatabaseCredentialPage(tenantId: number) {
    this.router.navigate(['tenant', tenantId, 'databaseCredential', 'add']);
  }
}
