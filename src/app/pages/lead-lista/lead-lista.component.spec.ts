import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadListaComponent } from './lead-lista.component';

describe('LeadListaComponent', () => {
  let component: LeadListaComponent;
  let fixture: ComponentFixture<LeadListaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeadListaComponent]
    });
    fixture = TestBed.createComponent(LeadListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
