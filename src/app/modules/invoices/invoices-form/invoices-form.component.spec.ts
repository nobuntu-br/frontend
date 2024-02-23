import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicesFormComponent } from './invoices-form.component';

describe('InvoicesFormComponent', () => {
  let component: InvoicesFormComponent;
  let fixture: ComponentFixture<InvoicesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoicesFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoicesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
