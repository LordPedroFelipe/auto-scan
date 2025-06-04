import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MicRecordingSnackComponent } from './mic-recording-snack.component';

describe('MicRecordingSnackComponent', () => {
  let component: MicRecordingSnackComponent;
  let fixture: ComponentFixture<MicRecordingSnackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MicRecordingSnackComponent]
    });
    fixture = TestBed.createComponent(MicRecordingSnackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
