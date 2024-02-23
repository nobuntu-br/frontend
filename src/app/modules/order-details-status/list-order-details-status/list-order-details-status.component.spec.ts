import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOrderDetailsStatusComponent } from './list-order-details-status.component';

describe('ListOrderDetailsStatusComponent', () => {
  let component: ListOrderDetailsStatusComponent;
  let fixture: ComponentFixture<ListOrderDetailsStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListOrderDetailsStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOrderDetailsStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
