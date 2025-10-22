import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpParams,
    HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class ShopIdInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Só intercepta chamadas da sua API
    const isApiCall = req.url.startsWith(environment.apiUrl);
    if (!isApiCall) {
      return next.handle(req);
    }

    const shopId = this.authService.getShopId?.() ?? null;

    // Se não houver shopId, segue a requisição original
    if (!shopId) {
      return next.handle(req);
    }

    // Se já existe shopId explicitamente nos params, não duplica
    const hasShopId = req.params?.has('shopId');
    if (hasShopId) {
      return next.handle(req);
    }

    // Clona a request adicionando o shopId como query param
    const newParams: HttpParams = (req.params || new HttpParams()).set('shopId', String(shopId));

    const cloned = req.clone({
      params: newParams
    });

    return next.handle(cloned);
  }
}
