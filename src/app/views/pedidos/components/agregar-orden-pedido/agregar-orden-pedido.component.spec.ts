import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarOrdenPedidoComponent } from './agregar-orden-pedido.component';

describe('AgregarOrdenPedidoComponent', () => {
  let component: AgregarOrdenPedidoComponent;
  let fixture: ComponentFixture<AgregarOrdenPedidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarOrdenPedidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarOrdenPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
