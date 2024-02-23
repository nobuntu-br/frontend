import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderDetailsFormComponent } from './purchase-order-details-form.component';

describe('PurchaseOrderDetailsFormComponent', () => {
  let component: PurchaseOrderDetailsFormComponent;
  let fixture: ComponentFixture<PurchaseOrderDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseOrderDetailsFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseOrderDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
