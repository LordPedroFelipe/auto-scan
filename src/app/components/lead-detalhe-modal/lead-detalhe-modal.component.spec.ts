import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadDetalheModalComponent } from './lead-detalhe-modal.component';

describe('LeadDetalheModalComponent', () => {
  let component: LeadDetalheModalComponent;
  let fixture: ComponentFixture<LeadDetalheModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeadDetalheModalComponent]
    });
    fixture = TestBed.createComponent(LeadDetalheModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
