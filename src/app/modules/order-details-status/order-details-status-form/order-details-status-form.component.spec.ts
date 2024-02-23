import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailsStatusFormComponent } from './order-details-status-form.component';

describe('OrderDetailsStatusFormComponent', () => {
  let component: OrderDetailsStatusFormComponent;
  let fixture: ComponentFixture<OrderDetailsStatusFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderDetailsStatusFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderDetailsStatusFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
