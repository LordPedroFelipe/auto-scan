import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertService } from '../services/alert.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private alert: AlertService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        const rotaAtual = this.router.url;
        let mensagem = 'Erro inesperado.';

        if (error.status === 0) {
          mensagem = 'Servidor indisponível.';
        } else if (error.status === 401) {
          mensagem = 'Você não está autorizado.';
        } else if (error.status === 403) {
          mensagem = 'Acesso negado.';
        } else if (error.status === 500) {
          mensagem = 'Erro interno do servidor.';
        } else if (error.error?.detalhes) {
          mensagem = error.error.detalhes;
        } else if (typeof error.error === 'string') {
          mensagem = error.error;
        }

        if (!rotaAtual.startsWith('/atendimento')) {
          this.alert.showError(mensagem);
        }
        return throwError(() => new Error(mensagem));
      })
    );
  }
}
