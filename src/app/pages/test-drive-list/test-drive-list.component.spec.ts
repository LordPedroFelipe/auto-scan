import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestDriveListComponent } from './test-drive-list.component';

describe('TestDriveListComponent', () => {
  let component: TestDriveListComponent;
  let fixture: ComponentFixture<TestDriveListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestDriveListComponent]
    });
    fixture = TestBed.createComponent(TestDriveListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
