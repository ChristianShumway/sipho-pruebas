import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VitrinasComponent } from './vitrinas.component';

describe('VitrinasComponent', () => {
  let component: VitrinasComponent;
  let fixture: ComponentFixture<VitrinasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VitrinasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VitrinasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
