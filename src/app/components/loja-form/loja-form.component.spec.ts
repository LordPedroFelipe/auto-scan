import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LojaFormComponent } from './loja-form.component';

describe('LojaFormComponent', () => {
  let component: LojaFormComponent;
  let fixture: ComponentFixture<LojaFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LojaFormComponent]
    });
    fixture = TestBed.createComponent(LojaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
