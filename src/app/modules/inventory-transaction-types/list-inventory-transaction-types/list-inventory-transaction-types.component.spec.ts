import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInventoryTransactionTypesComponent } from './list-inventory-transaction-types.component';

describe('ListInventoryTransactionTypesComponent', () => {
  let component: ListInventoryTransactionTypesComponent;
  let fixture: ComponentFixture<ListInventoryTransactionTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListInventoryTransactionTypesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListInventoryTransactionTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
