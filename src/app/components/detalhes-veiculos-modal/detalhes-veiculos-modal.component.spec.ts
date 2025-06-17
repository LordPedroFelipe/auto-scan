import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhesVeiculosModalComponent } from './detalhes-veiculos-modal.component';

describe('DetalhesVeiculosModalComponent', () => {
  let component: DetalhesVeiculosModalComponent;
  let fixture: ComponentFixture<DetalhesVeiculosModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetalhesVeiculosModalComponent]
    });
    fixture = TestBed.createComponent(DetalhesVeiculosModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
