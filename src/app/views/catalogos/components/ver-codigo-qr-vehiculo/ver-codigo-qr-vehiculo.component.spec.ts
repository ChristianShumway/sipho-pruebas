import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerCodigoQrVehiculoComponent } from './ver-codigo-qr-vehiculo.component';

describe('VerCodigoQrVehiculoComponent', () => {
  let component: VerCodigoQrVehiculoComponent;
  let fixture: ComponentFixture<VerCodigoQrVehiculoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerCodigoQrVehiculoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerCodigoQrVehiculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
