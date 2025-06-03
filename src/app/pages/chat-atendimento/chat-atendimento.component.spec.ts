import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatAtendimentoComponent } from './chat-atendimento.component';

describe('ChatAtendimentoComponent', () => {
  let component: ChatAtendimentoComponent;
  let fixture: ComponentFixture<ChatAtendimentoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatAtendimentoComponent]
    });
    fixture = TestBed.createComponent(ChatAtendimentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
