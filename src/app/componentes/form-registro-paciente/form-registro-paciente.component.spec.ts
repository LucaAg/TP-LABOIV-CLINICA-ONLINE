import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRegistroPacienteComponent } from './form-registro-paciente.component';

describe('FormRegistroPacienteComponent', () => {
  let component: FormRegistroPacienteComponent;
  let fixture: ComponentFixture<FormRegistroPacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormRegistroPacienteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormRegistroPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
