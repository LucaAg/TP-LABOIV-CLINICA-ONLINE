import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRegistroAdminComponent } from './form-registro-admin.component';

describe('FormRegistroAdminComponent', () => {
  let component: FormRegistroAdminComponent;
  let fixture: ComponentFixture<FormRegistroAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormRegistroAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormRegistroAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
