import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationPickerFieldComponent } from './location-picker-field.component';

describe('LocationPickerFieldComponent', () => {
  let component: LocationPickerFieldComponent;
  let fixture: ComponentFixture<LocationPickerFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationPickerFieldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationPickerFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
