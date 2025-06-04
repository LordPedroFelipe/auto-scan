import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, delay, retry, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { SendMessageRequest } from '../models/send-message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly apiUrl = `${environment.apiUrl}/Chat`;

  // Cache e estado de loading
  private _sessionsCache: any[] | null = null;
  private _messagesCache: { [sessionId: string]: any[] } = {};

  private _loadingSessions = new BehaviorSubject<boolean>(false);
  private _loadingMessages = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  /** Envia mensagem para o chatbot */
  sendMessage(data: SendMessageRequest): Observable<string> {
    return this.http.post(`${this.apiUrl}/send`, data, { responseType: 'text' }).pipe(
      tap(() => console.log('[ChatService] Mensagem enviada com sucesso')),
      catchError((error) => {
        console.error('[ChatService] Erro ao enviar mensagem', error);
        return throwError(() => error);
      })
    );
  }

  /** Reseta uma sessão */
  reset(sessionId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/reset`, sessionId).pipe(
      tap(() => {
        console.log(`[ChatService] Sessão ${sessionId} resetada`);
        // Limpa cache dessa sessão
        delete this._messagesCache[sessionId];
        this._sessionsCache = null;
      }),
      catchError((error) => {
        console.error('[ChatService] Erro ao resetar sessão', error);
        return throwError(() => error);
      })
    );
  }

  /** Carrega sessões com cache e retry */
  getSessions(): Observable<any[]> {
    if (this._sessionsCache) {
      console.log('[ChatService] Retornando sessões do cache');
      return of(this._sessionsCache);
    }

    this._loadingSessions.next(true);
    return this.http.get<any[]>(`${this.apiUrl}/sessions`).pipe(
      retry(2),
      delay(300),
      tap((data) => {
        this._sessionsCache = data;
        console.log('[ChatService] Sessões carregadas do servidor:', data);
        this._loadingSessions.next(false);
      }),
      catchError((error) => {
        this._loadingSessions.next(false);
        console.error('[ChatService] Erro ao buscar sessões', error);
        return throwError(() => error);
      })
    );
  }

  /** Loading das sessões (observável) */
  isLoadingSessions(): Observable<boolean> {
    return this._loadingSessions.asObservable();
  }

  /** Carrega mensagens de uma sessão específica com cache */
  getMessages(sessionId: string): Observable<any[]> {
    if (this._messagesCache[sessionId]) {
      console.log(`[ChatService] Mensagens da sessão ${sessionId} vindas do cache`);
      return of(this._messagesCache[sessionId]);
    }

    this._loadingMessages.next(true);
    return this.http.get<any[]>(`${this.apiUrl}/session/${sessionId}/messages`).pipe(
      retry(1),
      delay(200),
      tap((messages) => {
        this._messagesCache[sessionId] = messages;
        console.log(`[ChatService] Mensagens carregadas da sessão ${sessionId}`, messages);
        this._loadingMessages.next(false);
      }),
      catchError((error) => {
        this._loadingMessages.next(false);
        console.error('[ChatService] Erro ao buscar mensagens', error);
        return throwError(() => error);
      })
    );
  }

  /** Loading das mensagens (observável) */
  isLoadingMessages(): Observable<boolean> {
    return this._loadingMessages.asObservable();
  }

  /** Invalida o cache manualmente */
  clearCache(): void {
    console.log('[ChatService] Cache limpo manualmente');
    this._sessionsCache = null;
    this._messagesCache = {};
  }
}
