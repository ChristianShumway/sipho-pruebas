import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentasPorRecibirComponent } from './cuentas-por-recibir.component';

describe('CuentasPorRecibirComponent', () => {
  let component: CuentasPorRecibirComponent;
  let fixture: ComponentFixture<CuentasPorRecibirComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuentasPorRecibirComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentasPorRecibirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
