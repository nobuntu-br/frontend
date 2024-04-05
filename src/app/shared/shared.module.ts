//Modules
import { Injectable, NgModule } from '@angular/core';
import { CommonModule, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { TRANSLOCO_LOADER, TRANSLOCO_SCOPE, Translation, TranslocoLoader, TranslocoModule } from '@ngneat/transloco';
import { BaseResourceFilterComponent } from './components/filter/base-resource-filter/base-resource-filter.component';
import { NgxMaskModule } from 'ngx-mask';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { LayoutModule } from '@angular/cdk/layout';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { HttpClient } from '@angular/common/http';

//Components
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { FilterPeriodComponent } from './components/filter/filter-period/filter-period.component';
import { CalculatorComponent } from './components/calculator/calculator.component';
import { FilterTextComponent } from './components/filter/filter-text/filter-text.component';
import { FilterNumberWithConditionsComponent } from './components/filter/filter-number-with-conditions/filter-number-with-conditions.component';
import { FilterBooleanComponent } from './components/filter/filter-boolean/filter-boolean.component';
import { InputFieldComponent } from './components/input-field/input-field.component';
import { FieldComponent } from './components/field/field.component';
import { DateFieldComponent } from './components/date-field/date-field.component';
import { InputDateFieldComponent } from './components/input-date-field/input-date-field.component';
import { ForeignKeyInputFieldComponent } from './components/foreign-key-input-field/foreign-key-input-field.component';
import { SelectorInputFieldComponent } from './components/selector-input-field/selector-input-field.component';
import { SelectableCardComponent } from './components/selectable-card/selectable-card.component';
import { InputImageFieldComponent } from './components/input-image-field/input-image-field.component';
import { DefaultListComponent } from './components/default-list/default-list.component';
import { DefaultCardComponent } from './components/default-card/default-card.component';
import { GeneratedSimpleFormComponent } from './components/generated-simple-form/generated-simple-form.component';
import { GeneratedStepperFormComponent } from './components/generated-stepper-form/generated-stepper-form.component';
import { SelectedItemsListComponent } from './components/selected-items-list/selected-items-list.component';
import { SearchInputFieldComponent } from './components/search-input-field/search-input-field.component';
import { DefaultTableComponent } from './components/default-table/default-table.component';
import { DinamicBaseResourceFormComponent } from './components/dinamic-base-resource-form/dinamic-base-resource-form.component';
import { LayoutTestComponent } from './components/layout-test/layout-test.component';
import { LanguagesComponent } from './components/languages/languages.component';


@NgModule({
    imports: [
        CommonModule,
        NgSwitch,
        NgSwitchCase,
        NgSwitchDefault,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        RouterModule,
        MatFormFieldModule,
        MatInputModule,
        MatStepperModule,
        MatButtonModule,
        MatCheckboxModule,
        MatListModule,
        MatRadioModule,
        MatMenuModule,
        MatTableModule,
        MatPaginatorModule,
        TranslocoModule,
        NgxMaskModule.forRoot(),
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatDialogModule,
        MatSnackBarModule,
        LayoutModule,
        MatCardModule,
        MatDividerModule,
        MatTabsModule,
        MatToolbarModule,
        MatSidenavModule,
    ],
    providers: [
        { provide: TRANSLOCO_SCOPE, useValue: {scope: "components", alias:"componentsBase"} }
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatStepperModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatInputModule,
        BaseResourceFilterComponent,
        MatDialogModule,
        MatMenuModule,
        CalculatorComponent,
        InputFieldComponent,
        MatButtonModule,
        GeneratedSimpleFormComponent,
        DefaultListComponent,
        GeneratedStepperFormComponent,
        TranslocoModule,
        DinamicBaseResourceFormComponent,
        LanguagesComponent,

    ],
    declarations: [
        BaseResourceFilterComponent,
        FilterPeriodComponent,
        CalculatorComponent,
        FilterTextComponent,
        FilterNumberWithConditionsComponent,
        FilterBooleanComponent,
        InputFieldComponent,
        FieldComponent,
        DateFieldComponent,
        InputDateFieldComponent,
        ForeignKeyInputFieldComponent,
        SelectorInputFieldComponent,
        SelectableCardComponent,
        InputImageFieldComponent,
        DefaultListComponent,
        DefaultCardComponent,
        GeneratedSimpleFormComponent,
        GeneratedStepperFormComponent,
        SelectedItemsListComponent,
        SearchInputFieldComponent,
        DefaultTableComponent,
        DinamicBaseResourceFormComponent,
        SideNavComponent,
        ConfirmationDialogComponent,
        LayoutTestComponent,
        LanguagesComponent
    ],
})
export class SharedModule { }

