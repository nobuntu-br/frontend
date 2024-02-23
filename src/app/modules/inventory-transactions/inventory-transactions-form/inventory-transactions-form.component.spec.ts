import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryTransactionsFormComponent } from './inventory-transactions-form.component';

describe('InventoryTransactionsFormComponent', () => {
  let component: InventoryTransactionsFormComponent;
  let fixture: ComponentFixture<InventoryTransactionsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryTransactionsFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryTransactionsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
