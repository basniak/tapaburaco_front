import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseurl = environment.baseURL;

  constructor(private http: HttpClient) { }
  public getData(rota): Observable<any> {
    let tokenHeader = {
      'Content-Type': 'application/json'
    };
    return this.http.get(`${this.baseurl}${rota}`, { headers: tokenHeader })
  }
}
