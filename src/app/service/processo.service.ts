import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ProcessoService {

  private http = inject(HttpClient);

  listarProcessos(pageIndex: number, pageSize: number): Observable<any> {
    return this.http.get<any>('http://localhost:9999/api/v1/processos?page=' + pageIndex + '&size=' + pageSize + '&sort=dataCadastro,desc');
  }

  pegarProcesso(id: number): Observable<any> {
    return this.http.get<any>('http://localhost:9999/api/v1/processos/' + id);
  }

  salvarProcesso(processo: FormData): Observable<any> {
    return this.http.post<any>('http://localhost:9999/api/v1/processos', processo)
  }

  editarProcesso(processo: FormData): Observable<any> {
    return this.http.put<any>('http://localhost:9999/api/v1/processos', processo)
  }

  deletaProcesso(id: number): Observable<any> {
    return this.http.delete<any>('http://localhost:9999/api/v1/processos/' + id);
  }

  visualizarProcesso(id: number | undefined): Observable<any> {
    return this.http.patch<any>('http://localhost:9999/api/v1/processos/visualizar/' + id, null);
  }

}
