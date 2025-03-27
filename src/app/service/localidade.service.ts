import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class LocalidadeService {

  private http = inject(HttpClient);

  listarUfs(): Observable<any> {
    return this.http.get<any>('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
  }

  listarMunicipiosByUf(uf: string): Observable<any> {
    return this.http.get<any>('https://servicodados.ibge.gov.br/api/v1/localidades/estados/' + uf + '/municipios');
  }


}
