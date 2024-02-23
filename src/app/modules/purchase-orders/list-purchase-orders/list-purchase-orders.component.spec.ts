import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPurchaseOrdersComponent } from './list-purchase-orders.component';

describe('ListPurchaseOrdersComponent', () => {
  let component: ListPurchaseOrdersComponent;
  let fixture: ComponentFixture<ListPurchaseOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPurchaseOrdersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPurchaseOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
