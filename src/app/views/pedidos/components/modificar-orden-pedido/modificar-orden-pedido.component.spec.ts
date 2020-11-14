import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarOrdenPedidoComponent } from './modificar-orden-pedido.component';

describe('ModificarOrdenPedidoComponent', () => {
  let component: ModificarOrdenPedidoComponent;
  let fixture: ComponentFixture<ModificarOrdenPedidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModificarOrdenPedidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificarOrdenPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
