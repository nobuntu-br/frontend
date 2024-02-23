import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyApplicationTokenFormComponent } from './company-application-token-form.component';

describe('CompanyApplicationTokenFormComponent', () => {
  let component: CompanyApplicationTokenFormComponent;
  let fixture: ComponentFixture<CompanyApplicationTokenFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyApplicationTokenFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyApplicationTokenFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
