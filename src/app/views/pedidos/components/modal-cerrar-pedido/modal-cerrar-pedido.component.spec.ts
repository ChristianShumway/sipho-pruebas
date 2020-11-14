import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCerrarPedidoComponent } from './modal-cerrar-pedido.component';

describe('ModalCerrarPedidoComponent', () => {
  let component: ModalCerrarPedidoComponent;
  let fixture: ComponentFixture<ModalCerrarPedidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCerrarPedidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCerrarPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
