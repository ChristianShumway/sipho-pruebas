import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarVitrinaComponent } from './modificar-vitrina.component';

describe('ModificarVitrinaComponent', () => {
  let component: ModificarVitrinaComponent;
  let fixture: ComponentFixture<ModificarVitrinaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModificarVitrinaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificarVitrinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
