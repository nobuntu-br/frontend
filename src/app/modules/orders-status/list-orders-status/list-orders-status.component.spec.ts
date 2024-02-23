import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOrdersStatusComponent } from './list-orders-status.component';

describe('ListOrdersStatusComponent', () => {
  let component: ListOrdersStatusComponent;
  let fixture: ComponentFixture<ListOrdersStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListOrdersStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOrdersStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
