import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LojaDetalhesComponent } from './loja-detalhes.component';

describe('LojaDetalhesComponent', () => {
  let component: LojaDetalhesComponent;
  let fixture: ComponentFixture<LojaDetalhesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LojaDetalhesComponent]
    });
    fixture = TestBed.createComponent(LojaDetalhesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
