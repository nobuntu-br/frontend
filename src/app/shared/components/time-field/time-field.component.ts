import { Component, Inject, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { BaseFieldComponent } from '../base-field/base-field.component';

@Component({
  selector: 'app-time-field',
  templateUrl: './time-field.component.html',
  styleUrls: ['./time-field.component.scss']
})
export class TimeFieldComponent extends BaseFieldComponent implements OnInit, OnDestroy {
  @Input() label: string;
  @Input() charactersLimit: number;
  @Input() isRequired: boolean = false;
  @Input() className: string;
    /**
   * Valor padrão do campo
   */
    @Input() defaultValue: string;
  displayedLabel: string;
  selectedTime: string = ''; // Initial value or set based on requirements

  inputValue = new FormControl<Date | null>(null);
  
  private ngUnsubscribe = new Subject();

  constructor(protected injector: Injector, private dialog: MatDialog) {
    super(injector);
  }

  ngOnInit(): void {
    this.getDefaultValue();
    this.setLabel();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(TimePickerDialogComponent, {
      width: '400px',
      data: { selectedTime: this.selectedTime || this.inputValue.value }  // Passa o valor atual ou selecionado
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.selectedTime = result;  // Armazena o tempo selecionado
        this.inputValue.setValue(result);  // Atualiza o valor do formulário
      }
    });
  }

  setLabel() {
    this.setTranslation(this.className, this.label).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (translatedLabel: string) => {
        if (translatedLabel === (this.className + "." + this.label)) {
          const formattedLabel = this.formatDefaultVariableName(this.label);
          this.displayedLabel = this.setCharactersLimit(formattedLabel, this.charactersLimit);
        } else {
          this.displayedLabel = this.setCharactersLimit(translatedLabel, this.charactersLimit);
        }
      },
      error: (error) => {
        this.displayedLabel = this.setCharactersLimit(this.label, this.charactersLimit);
      },
    });
  }

  getDefaultValue() {
    if (this.defaultValue) {
      this.selectedTime = this.defaultValue;  // Armazena o tempo padrão
      this.inputValue.setValue(new Date(`1970-01-01T${this.defaultValue}:00`));  // Atualiza o valor do formulário
    }
  }


  validateTimeFormat(event: KeyboardEvent) {
    const input = (event.target as HTMLInputElement).value;
    const regex = /^([01]\d|2[0-3]):([0-5]\d)?$/; // Validates "HH:MM" format
    if (!regex.test(input) && event.key !== 'Backspace') {
      event.preventDefault();
    }
  }

  formatTimeInput(value: string) {
    // Remove any non-digit characters
    const cleanedValue = value.replace(/[^0-9]/g, '');
  
    if (cleanedValue.length <= 2) {
      // If only the hour part is present (1-2 digits)
      this.selectedTime = cleanedValue;
    } else if (cleanedValue.length <= 4) {
      // Format as HH:MM if 3-4 digits are available
      this.selectedTime = `${cleanedValue.slice(0, 2)}:${cleanedValue.slice(2)}`;
    } else {
      // Limit input to the first four digits (HHMM) if too many digits are entered
      this.selectedTime = `${cleanedValue.slice(0, 2)}:${cleanedValue.slice(2, 4)}`;
    }
  }
  
  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-time-picker-dialog',
  templateUrl: './dialog-time-input.html',
  styleUrls: ['./dialog-time-input.scss']
})

export class TimePickerDialogComponent {
  @Input() title?: string;
  @Input() cancelLabel?: string;
  @Input() confirmLabel?: string;
  @Input() minTime?: string;
  @Input() maxTime?: string;
  selectedTime: string = '';
  selectedMinute: string = '';

  constructor(
    public dialogRef: MatDialogRef<TimePickerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.selectedTime = data.selectedTime || '12:00'; // Hora inicial padrão
    this.selectedMinute = this.selectedTime.split(':')[1]; // Pega os minutos da hora
  }

  onConfirm(): void {
    this.dialogRef.close(this.selectedTime); // Retorna o valor selecionado
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  adjustTime(amount: number, unit: 'hour' | 'minute'): void {
    let [hour, minute] = this.selectedTime.split(':').map(Number);
  
    if (unit === 'hour') {
      hour = (hour + amount) % 24; // Ajusta o valor da hora
      if (hour < 0) hour = 23;
    } else {
      minute = (minute + amount) % 60; // Ajusta o valor do minuto
      if (minute < 0) minute = 59;
    }
  
    this.selectedTime = `${this.padNumber(hour)}:${this.padNumber(minute)}`;
  }
  
  padNumber(value: number): string {
    return value.toString().padStart(2, '0');
  }


  
}

