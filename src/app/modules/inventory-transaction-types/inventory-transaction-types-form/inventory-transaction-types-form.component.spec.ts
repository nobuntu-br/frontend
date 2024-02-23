import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryTransactionTypesFormComponent } from './inventory-transaction-types-form.component';

describe('InventoryTransactionTypesFormComponent', () => {
  let component: InventoryTransactionTypesFormComponent;
  let fixture: ComponentFixture<InventoryTransactionTypesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryTransactionTypesFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryTransactionTypesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
