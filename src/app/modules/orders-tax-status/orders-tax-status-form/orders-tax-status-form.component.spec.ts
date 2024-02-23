import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersTaxStatusFormComponent } from './orders-tax-status-form.component';

describe('OrdersTaxStatusFormComponent', () => {
  let component: OrdersTaxStatusFormComponent;
  let fixture: ComponentFixture<OrdersTaxStatusFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdersTaxStatusFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdersTaxStatusFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
