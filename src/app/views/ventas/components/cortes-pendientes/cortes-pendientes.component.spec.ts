import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CortesPendientesComponent } from './cortes-pendientes.component';

describe('CortesPendientesComponent', () => {
  let component: CortesPendientesComponent;
  let fixture: ComponentFixture<CortesPendientesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CortesPendientesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CortesPendientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
