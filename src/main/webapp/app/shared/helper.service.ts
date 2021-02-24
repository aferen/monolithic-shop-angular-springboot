import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';


@Injectable()
export class HelperService {
  constructor() {}

  public getUrl(path): string {
    return environment.app.apiBaseUrl;
  }
}
