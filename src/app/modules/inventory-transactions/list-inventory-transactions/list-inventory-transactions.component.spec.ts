import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInventoryTransactionsComponent } from './list-inventory-transactions.component';

describe('ListInventoryTransactionsComponent', () => {
  let component: ListInventoryTransactionsComponent;
  let fixture: ComponentFixture<ListInventoryTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListInventoryTransactionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListInventoryTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
