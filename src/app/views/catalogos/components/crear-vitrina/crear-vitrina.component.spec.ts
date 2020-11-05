import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearVitrinaComponent } from './crear-vitrina.component';

describe('CrearVitrinaComponent', () => {
  let component: CrearVitrinaComponent;
  let fixture: ComponentFixture<CrearVitrinaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearVitrinaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearVitrinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
