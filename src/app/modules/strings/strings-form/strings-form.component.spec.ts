import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StringsFormComponent } from './strings-form.component';

describe('StringsFormComponent', () => {
  let component: StringsFormComponent;
  let fixture: ComponentFixture<StringsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StringsFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StringsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
