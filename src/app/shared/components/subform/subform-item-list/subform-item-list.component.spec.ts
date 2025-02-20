import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubformItemListComponent } from './subform-item-list.component';

describe('SubformItemListComponent', () => {
  let component: SubformItemListComponent;
  let fixture: ComponentFixture<SubformItemListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubformItemListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubformItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
