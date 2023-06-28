import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormHistorialClinicoComponent } from './form-historial-clinico.component';

describe('FormHistorialClinicoComponent', () => {
  let component: FormHistorialClinicoComponent;
  let fixture: ComponentFixture<FormHistorialClinicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormHistorialClinicoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormHistorialClinicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
