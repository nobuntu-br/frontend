import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesReportsFormComponent } from './sales-reports-form.component';

describe('SalesReportsFormComponent', () => {
  let component: SalesReportsFormComponent;
  let fixture: ComponentFixture<SalesReportsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesReportsFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesReportsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
