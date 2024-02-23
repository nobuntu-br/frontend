import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOrdersTaxStatusComponent } from './list-orders-tax-status.component';

describe('ListOrdersTaxStatusComponent', () => {
  let component: ListOrdersTaxStatusComponent;
  let fixture: ComponentFixture<ListOrdersTaxStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListOrdersTaxStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOrdersTaxStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
