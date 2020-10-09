import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarVehiculoComponent } from './modificar-vehiculo.component';

describe('ModificarVehiculoComponent', () => {
  let component: ModificarVehiculoComponent;
  let fixture: ComponentFixture<ModificarVehiculoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModificarVehiculoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificarVehiculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
