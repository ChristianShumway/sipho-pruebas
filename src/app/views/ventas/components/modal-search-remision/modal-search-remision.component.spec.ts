import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSearchRemisionComponent } from './modal-search-remision.component';

describe('ModalSearchRemisionComponent', () => {
  let component: ModalSearchRemisionComponent;
  let fixture: ComponentFixture<ModalSearchRemisionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalSearchRemisionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSearchRemisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
