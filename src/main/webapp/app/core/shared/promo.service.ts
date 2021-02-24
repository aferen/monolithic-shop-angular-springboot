import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Promo } from '../../models/promo.model';
import { HelperService } from '../../shared/helper.service';

@Injectable()
export class PromoService {
  constructor(
    private http: HttpClient,
    private helperService : HelperService
    ) {}

  getPromos(): Observable<Promo[]> {
    return this.http.get<Promo[]>(this.helperService.getUrl("promos"));
  }
}
