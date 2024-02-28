import { NgModule } from '@angular/core';
import { CommonModule, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { BaseResourceFilterComponent } from './components/filter/base-resource-filter/base-resource-filter.component';
import { NgxMaskModule } from 'ngx-mask';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
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
import { MatSnackBarModule } from '@angular/material/snack-bar';

// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { LanguagesComponent } from './components/languages/languages.component';

export const loader = ['en', 'pt'].reduce((acc, lang) => {
    acc[lang] = () => import(`../../assets/i18n/${lang}.json`);
    return acc;
}, {});

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        RouterModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatStepperModule,
        MatCheckboxModule,
        MatListModule,
        MatRadioModule,
        MatMenuModule,
        MatTableModule,
        MatPaginatorModule,
        NgSwitch,
        NgSwitchCase,
        NgSwitchDefault,
        TranslocoModule,

        NgxMaskModule.forRoot(),
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatDialogModule,

        //adicionados
        MatSnackBarModule,
        // BrowserAnimationsModule,
        LayoutModule,
        MatCardModule,
        MatDividerModule,
        MatTabsModule,
        MatSidenavModule,
        MatToolbarModule
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
        CalculatorComponent,
        InputFieldComponent,
        MatButtonModule,
        GeneratedSimpleFormComponent,
        DefaultListComponent,
        GeneratedStepperFormComponent,
        TranslocoModule,
        DinamicBaseResourceFormComponent,
        LanguagesComponent
    ],
    declarations: [
        BaseResourceFilterComponent,
        LanguagesComponent,
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
        ConfirmationDialogComponent
    ],
    providers: [{ provide: TRANSLOCO_SCOPE, useValue: { scope: 'core', loader: loader }, }],
})
export class SharedModule { }

