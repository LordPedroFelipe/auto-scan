import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoPalavrasComponent } from './grafico-palavras.component';

describe('GraficoPalavrasComponent', () => {
  let component: GraficoPalavrasComponent;
  let fixture: ComponentFixture<GraficoPalavrasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GraficoPalavrasComponent]
    });
    fixture = TestBed.createComponent(GraficoPalavrasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
