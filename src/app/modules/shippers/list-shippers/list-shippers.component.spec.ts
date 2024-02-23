import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListShippersComponent } from './list-shippers.component';

describe('ListShippersComponent', () => {
  let component: ListShippersComponent;
  let fixture: ComponentFixture<ListShippersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListShippersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListShippersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
