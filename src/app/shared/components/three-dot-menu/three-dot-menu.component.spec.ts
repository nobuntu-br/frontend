import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeDotMenuComponent } from './three-dot-menu.component';

describe('ThreeDotMenuComponent', () => {
  let component: ThreeDotMenuComponent;
  let fixture: ComponentFixture<ThreeDotMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreeDotMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThreeDotMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
