import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPermisosComponent } from './modal-permisos.component';

describe('ModalPermisosComponent', () => {
  let component: ModalPermisosComponent;
  let fixture: ComponentFixture<ModalPermisosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPermisosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPermisosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
