import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOrderDetailsComponent } from './list-order-details.component';

describe('ListOrderDetailsComponent', () => {
  let component: ListOrderDetailsComponent;
  let fixture: ComponentFixture<ListOrderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListOrderDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
