import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerCortesComponent } from './ver-cortes.component';

describe('VerCortesComponent', () => {
  let component: VerCortesComponent;
  let fixture: ComponentFixture<VerCortesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerCortesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerCortesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
