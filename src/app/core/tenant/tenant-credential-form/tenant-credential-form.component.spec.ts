import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantCredentialFormComponent } from './tenant-credential-form.component';

describe('TenantCredentialFormComponent', () => {
  let component: TenantCredentialFormComponent;
  let fixture: ComponentFixture<TenantCredentialFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TenantCredentialFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenantCredentialFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
