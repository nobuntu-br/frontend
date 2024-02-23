import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersStatusFormComponent } from './orders-status-form.component';

describe('OrdersStatusFormComponent', () => {
  let component: OrdersStatusFormComponent;
  let fixture: ComponentFixture<OrdersStatusFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdersStatusFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdersStatusFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
