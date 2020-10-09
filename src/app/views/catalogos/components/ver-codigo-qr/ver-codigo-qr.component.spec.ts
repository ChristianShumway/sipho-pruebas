import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerCodigoQrComponent } from './ver-codigo-qr.component';

describe('VerCodigoQrComponent', () => {
  let component: VerCodigoQrComponent;
  let fixture: ComponentFixture<VerCodigoQrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerCodigoQrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerCodigoQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
