import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimularFinanciamentoComponent } from './simular-financiamento.component';

describe('SimularFinanciamentoComponent', () => {
  let component: SimularFinanciamentoComponent;
  let fixture: ComponentFixture<SimularFinanciamentoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SimularFinanciamentoComponent]
    });
    fixture = TestBed.createComponent(SimularFinanciamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
