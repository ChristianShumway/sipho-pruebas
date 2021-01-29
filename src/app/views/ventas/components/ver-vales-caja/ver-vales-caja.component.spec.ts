import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerValesCajaComponent } from './ver-vales-caja.component';

describe('VerValesCajaComponent', () => {
  let component: VerValesCajaComponent;
  let fixture: ComponentFixture<VerValesCajaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerValesCajaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerValesCajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
