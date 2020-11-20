import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDevolucionPedidoComponent } from './form-devolucion-pedido.component';

describe('FormDevolucionPedidoComponent', () => {
  let component: FormDevolucionPedidoComponent;
  let fixture: ComponentFixture<FormDevolucionPedidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormDevolucionPedidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDevolucionPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
