import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroVeiculoModalComponent } from './cadastro-veiculo-modal.component';

describe('CadastroVeiculoModalComponent', () => {
  let component: CadastroVeiculoModalComponent;
  let fixture: ComponentFixture<CadastroVeiculoModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CadastroVeiculoModalComponent]
    });
    fixture = TestBed.createComponent(CadastroVeiculoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
