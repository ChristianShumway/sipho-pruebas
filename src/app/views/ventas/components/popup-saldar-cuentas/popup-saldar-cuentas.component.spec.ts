import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupSaldarCuentasComponent } from './popup-saldar-cuentas.component';

describe('PopupSaldarCuentasComponent', () => {
  let component: PopupSaldarCuentasComponent;
  let fixture: ComponentFixture<PopupSaldarCuentasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupSaldarCuentasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupSaldarCuentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
