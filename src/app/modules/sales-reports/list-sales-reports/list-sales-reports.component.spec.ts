import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSalesReportsComponent } from './list-sales-reports.component';

describe('ListSalesReportsComponent', () => {
  let component: ListSalesReportsComponent;
  let fixture: ComponentFixture<ListSalesReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListSalesReportsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListSalesReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
