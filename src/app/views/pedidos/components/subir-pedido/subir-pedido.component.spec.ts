import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubirPedidoComponent } from './subir-pedido.component';

describe('SubirPedidoComponent', () => {
  let component: SubirPedidoComponent;
  let fixture: ComponentFixture<SubirPedidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubirPedidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubirPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
