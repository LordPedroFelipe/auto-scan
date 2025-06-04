import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertService } from '../services/alert.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private alert: AlertService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
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

        this.alert.showError(mensagem);
        return throwError(() => new Error(mensagem));
      })
    );
  }
}
