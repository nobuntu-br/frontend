import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantCredentialsFormComponent } from './tenant-credentials-form.component';

describe('TenantCredentialsFormComponent', () => {
  let component: TenantCredentialsFormComponent;
  let fixture: ComponentFixture<TenantCredentialsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TenantCredentialsFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenantCredentialsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
