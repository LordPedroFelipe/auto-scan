import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadFormModalComponent } from './lead-form-modal.component';

describe('LeadFormModalComponent', () => {
  let component: LeadFormModalComponent;
  let fixture: ComponentFixture<LeadFormModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeadFormModalComponent]
    });
    fixture = TestBed.createComponent(LeadFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
