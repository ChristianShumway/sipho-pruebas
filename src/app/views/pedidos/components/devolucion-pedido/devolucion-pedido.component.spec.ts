import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevolucionPedidoComponent } from './devolucion-pedido.component';

describe('DevolucionPedidoComponent', () => {
  let component: DevolucionPedidoComponent;
  let fixture: ComponentFixture<DevolucionPedidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevolucionPedidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevolucionPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
