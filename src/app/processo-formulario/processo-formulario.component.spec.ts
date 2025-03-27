import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessoFormularioComponent } from './processo-formulario.component';

describe('ProcessoFormularioComponent', () => {
  let component: ProcessoFormularioComponent;
  let fixture: ComponentFixture<ProcessoFormularioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessoFormularioComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProcessoFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
