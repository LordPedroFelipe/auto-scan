import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VeiculoDetalhesComponent } from './veiculo-detalhes.component';

describe('VeiculoDetalhesComponent', () => {
  let component: VeiculoDetalhesComponent;
  let fixture: ComponentFixture<VeiculoDetalhesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VeiculoDetalhesComponent]
    });
    fixture = TestBed.createComponent(VeiculoDetalhesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
