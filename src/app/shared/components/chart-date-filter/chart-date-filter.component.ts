import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IDateRange } from '../default-graphic/default-graphic.component';


@Component({
  selector: 'app-chart-date-filter',
  templateUrl: './chart-date-filter.component.html',
  styleUrls: ['./chart-date-filter.component.scss']
})
export class ChartDateFilterComponent implements OnInit {
  filterForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ChartDateFilterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDateRange
  ) {
    this.filterForm = this.fb.group({
      startDate: [null],
      endDate: [null]
    });
  }

  ngOnInit(): void {
    if (this.data.endDate === null && this.data.startDate === null) {
      console.log('Data não informada');
      this.filterForm.setValue({ startDate: Date.now(), endDate: Date.now() });
    } else {
      this.filterForm.patchValue(this.data);
    }
  }

  onSearch(): void {
    if(this.filterForm.valid){
      if (!this.validateDate()) {
        const filterValues = this.filterForm.value;
        this.dialogRef.close(filterValues);
      } else {
        alert('Data inicial não pode ser maior que a data final');
      }
    }
  }

  validateDate(): boolean {
    return this.filterForm.get('startDate').value > this.filterForm.get('endDate').value;
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
