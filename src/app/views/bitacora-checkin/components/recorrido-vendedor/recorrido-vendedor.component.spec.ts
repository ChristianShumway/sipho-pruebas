import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecorridoVendedorComponent } from './recorrido-vendedor.component';

describe('RecorridoVendedorComponent', () => {
  let component: RecorridoVendedorComponent;
  let fixture: ComponentFixture<RecorridoVendedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecorridoVendedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecorridoVendedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
