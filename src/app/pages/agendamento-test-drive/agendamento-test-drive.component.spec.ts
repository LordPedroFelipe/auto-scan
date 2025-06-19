import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendamentoTestDriveComponent } from './agendamento-test-drive.component';

describe('AgendamentoTestDriveComponent', () => {
  let component: AgendamentoTestDriveComponent;
  let fixture: ComponentFixture<AgendamentoTestDriveComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgendamentoTestDriveComponent]
    });
    fixture = TestBed.createComponent(AgendamentoTestDriveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
