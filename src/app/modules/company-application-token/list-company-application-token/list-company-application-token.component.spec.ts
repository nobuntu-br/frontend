import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCompanyApplicationTokenComponent } from './list-company-application-token.component';

describe('ListCompanyApplicationTokenComponent', () => {
  let component: ListCompanyApplicationTokenComponent;
  let fixture: ComponentFixture<ListCompanyApplicationTokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCompanyApplicationTokenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListCompanyApplicationTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
