import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, throwError } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LocalidadeService } from '../service/localidade.service';
import { ProcessoService } from '../service/processo.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { NgxMaskDirective } from 'ngx-mask';

export interface Estado {
  nome: string;
  sigla: string;
}

export interface Municipio {
  nome: string;
}

@Component({
  selector: 'app-processo-listagem',
  templateUrl: './processo-formulario.component.html',
  styleUrl: './processo-formulario.component.css',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    RouterLink,
    NgxMaskDirective,
    MatAutocompleteModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    AsyncPipe,
  ],
})
export class ProcessoFormularioComponent {

  private localidadeService = inject(LocalidadeService);
  private processoService = inject(ProcessoService);
  private routes = inject(ActivatedRoute);
  private router = inject(Router);
  public pdfDocumento: Blob | undefined;

  processoForm = new FormGroup({
    id: new FormControl(''),
    npu: new FormControl('', Validators.required),
    uf: new FormControl('', Validators.required),
    municipio: new FormControl('', Validators.required),
    pdfDocumentoFileName: new FormControl('', Validators.required),
  });

  estadosFiltrados: Observable<Estado[]>;
  municipiosFiltrados: Observable<Municipio[]>;
  estados: Estado[] = [];
  municipios: Municipio[] = [];

  constructor() {
    this.estadosFiltrados = this.processoForm.controls.uf.valueChanges.pipe(
      startWith(''),
      map(estado => (estado ? this.filtrarEstados(estado) : this.estados.slice())),
    );
    this.municipiosFiltrados = this.processoForm.controls.municipio.valueChanges.pipe(
      startWith(''),
      map(municipio => (municipio ? this.filtrarMunicipios(municipio) : this.municipios.slice())),
    );
    this.listarUfs();
    const id = this.routes.snapshot.paramMap.get('id');
    this.getProcessoById(id);
    this.processoForm.controls.pdfDocumentoFileName.disable();
  }

  listarUfs() {
    this.localidadeService.listarUfs().pipe(
      catchError(data => {
        alert(data.error.message);
        return throwError(() => new Error(data.error.message));
      })
    ).subscribe(data => {
      this.estados = data;
    });
  }

  public listarMunicipiosByUf(uf: string) {
    this.processoForm.controls.municipio.reset();
    this.listarMunicipiosServiceByUf(uf);
  }

  private listarMunicipiosServiceByUf(uf: string) {
    this.localidadeService.listarMunicipiosByUf(uf).pipe(
      catchError(data => {
        alert(data.error.message);
        return throwError(() => new Error(data.error.message));
      })
    ).subscribe(data => {
      this.municipios = [];
      this.municipios = data;
    });
  }

  getProcessoById(id: string | null) {
    if (id) {
      this.processoService.pegarProcesso(Number.parseInt(id))
        .pipe(
          catchError(data => {
            alert(data.error.message);
            return throwError(() => new Error(data.error.message));
          })
        )
        .subscribe(data => {
          this.processoForm.reset();
          this.processoForm.controls.id.setValue(data.response.id);
          this.processoForm.controls.npu.setValue(data.response.npu);
          this.processoForm.controls.uf.setValue(data.response.uf);
          this.processoForm.controls.municipio.setValue(data.response.municipio);
          this.processoForm.controls.pdfDocumentoFileName.setValue(data.response.pdfDocumentoFileName);
          this.pdfDocumento = this.base64ToFile(data.response.pdfDocumento, data.response.pdfDocumentoFileName);
          this.listarMunicipiosServiceByUf(data.response.uf);
        })
    }
  }

  base64ToFile(base64String: string, pdfDocumentoFileName: string) {
    const byteCharacters = atob(base64String);
    const byteArrays = [];
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays.push(byteCharacters.charCodeAt(i));
    }
    const byteArray = new Uint8Array(byteArrays);
    return new File([new Blob([byteArray], { type: 'application/pdf' })], pdfDocumentoFileName);
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if ((file.size / 1024 / 1024) > 15) {
      alert('O documento em PDF não pode exceder 15MB');
    } else {
      this.processoForm.controls.pdfDocumentoFileName.setValue(file.name);
      this.pdfDocumento = file;
    }
  }

  onSubmit() {
    let id = this.processoForm.controls.id.value;
    let npu = this.processoForm.controls.npu.value;
    let uf = this.processoForm.controls.uf.value;
    let municipio = this.processoForm.controls.municipio.value;

    if (!this.pdfDocumento || !this.processoForm.controls.pdfDocumentoFileName.value){
      alert('Campo Documento em PDF é obrigatório');
      return;
    }

    const formData = new FormData();
    formData.append("npu", npu ? npu : '');
    formData.append("uf", uf ? uf : '');
    formData.append("municipio", municipio ? municipio : '');
    formData.append("pdfDocumento", this.pdfDocumento ? this.pdfDocumento : '');

    if (id) {
      formData.append("id", id ? id : '');
      this.processoService
        .editarProcesso(formData)
        .pipe(
          catchError(data => {
            alert(data.error.message);
            return throwError(() => new Error(data.error.message));
          })
        )
        .subscribe(data => {
          alert(data.message);
          this.router.navigateByUrl('/processo-listagem');
        });
    } else {
      this.processoService
        .salvarProcesso(formData)
        .pipe(
          catchError(data => {
            alert(data.error.message);
            return throwError(() => new Error(data.error.message));
          })
        )
        .subscribe(data => {
          alert(data.message);
          this.router.navigateByUrl('/processo-listagem');
        });
    }
  }

  private filtrarEstados(value: string): Estado[] {
    const filterValue = value.toLowerCase();
    return this.estados.filter(estado => estado.nome.toLowerCase().includes(filterValue) || estado.sigla.toLowerCase().includes(filterValue));
  }

  private filtrarMunicipios(value: string): Municipio[] {
    const filterValue = value.toLowerCase();
    return this.municipios.filter(municipio => municipio.nome.toLowerCase().includes(filterValue));
  }
}
