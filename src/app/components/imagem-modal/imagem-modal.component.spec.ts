import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagemModalComponent } from './imagem-modal.component';

describe('ImagemModalComponent', () => {
  let component: ImagemModalComponent;
  let fixture: ComponentFixture<ImagemModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImagemModalComponent]
    });
    fixture = TestBed.createComponent(ImagemModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
