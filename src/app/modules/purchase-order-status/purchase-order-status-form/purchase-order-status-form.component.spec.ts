import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderStatusFormComponent } from './purchase-order-status-form.component';

describe('PurchaseOrderStatusFormComponent', () => {
  let component: PurchaseOrderStatusFormComponent;
  let fixture: ComponentFixture<PurchaseOrderStatusFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseOrderStatusFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseOrderStatusFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
