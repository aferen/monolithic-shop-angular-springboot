import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Promo } from '../../models/promo.model';
import { SERVER_API_URL } from '@app/app.constants';

@Injectable()
export class PromoService {
  constructor(
    private http: HttpClient
  ) {}

  getPromos(): Observable<Promo[]> {
    return this.http.get<Promo[]>(SERVER_API_URL + 'api/promos');
  }
}
