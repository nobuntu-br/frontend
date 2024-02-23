import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPurchaseOrderStatusComponent } from './list-purchase-order-status.component';

describe('ListPurchaseOrderStatusComponent', () => {
  let component: ListPurchaseOrderStatusComponent;
  let fixture: ComponentFixture<ListPurchaseOrderStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPurchaseOrderStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPurchaseOrderStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
