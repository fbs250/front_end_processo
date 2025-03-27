import { ProcessoService } from '../service/processo.service';
import { MatButtonModule } from '@angular/material/button';
import { Processo } from '../processo';
import { catchError, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { Npu } from '../pipe/npu';

@Component({
  selector: 'app-processo-listagem',
  imports: [MatButtonModule,
    FormsModule,
    RouterLink,
    CommonModule,
    Npu,
    MatPaginatorModule,
    MatTableModule],
  templateUrl: './processo-listagem.component.html',
  styleUrl: './processo-listagem.component.css'
})


export class ProcessoListagemComponent implements AfterViewInit {

  private processoService = inject(ProcessoService);
  readonly dialog = inject(MatDialog);
  displayedColumns: string[] = ['npu', 'dataCadastro', 'uf', 'acoes'];
  dataSource = new MatTableDataSource<Processo>();
  length = 0;
  pageSize = 5;
  pageIndex = 0;
  pageEvent: PageEvent | undefined;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator !== undefined ? this.paginator : null;
    this.listarProcessos();
  }

  openDialog(id: number | null) {
    if (id) {
      this.processoService.visualizarProcesso(id)
        .pipe(
          catchError(data => {
            alert(data.error.message);
            return throwError(() => new Error(data.error.message));
          })
        )
        .subscribe(data => {
          this.dialog.open(DialogProcessoDetalhe, {
            data: {
              processo: data.response
            },
          });
        })
    }
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.listarProcessos();
  }

  listarProcessos() {
    this.processoService
      .listarProcessos(this.pageIndex, this.pageSize)
      .pipe(
        catchError(data => {
          alert(data.error.message);
          return throwError(() => new Error(data.error.message));
        })
      )
      .subscribe(data => {
        this.dataSource = new MatTableDataSource<Processo>(data.response.content);
        this.length = data.response.totalElements;
      });
  }

  public deleteById(id: number | null) {
    if (id) {
      this.processoService.deletaProcesso(id)
        .pipe(
          catchError(data => {
            alert(data.error.message);
            return throwError(() => new Error(data.error.message));
          })
        )
        .subscribe(data => {
          this.listarProcessos();
          alert(data.message);
        })
    }
  }
}

@Component({
  selector: 'dialog-processo-detalhe',
  templateUrl: 'dialog-processo-detalhe.html',
  imports: [
    MatDialogTitle, MatDialogContent, Npu, MatDialogActions, CommonModule, MatButtonModule
  ],
})
export class DialogProcessoDetalhe {
  readonly dialogRef = inject(MatDialogRef<DialogProcessoDetalhe>);
  data = inject(MAT_DIALOG_DATA);

  private base64ToFile(base64String: string, pdfDocumentoFileName: string) {
    const byteCharacters = atob(base64String);
    const byteArrays = [];
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays.push(byteCharacters.charCodeAt(i));
    }
    const byteArray = new Uint8Array(byteArrays);
    return new File([new Blob([byteArray], { type: 'application/pdf' })], pdfDocumentoFileName);
  }

  public download() {
    if (this.data.processo.pdfDocumento) {

      let blobPdf = this.base64ToFile(this.data.processo.pdfDocumento, this.data.processo.pdfDocumentoFileName);
      var a = window.document.createElement('a');
      a.href = window.URL.createObjectURL(blobPdf);
      let download = this.data.processo.pdfDocumentoFileName;
      a.download = download ? download : '';
      document.body.appendChild(a)
      a.click();
      document.body.removeChild(a)
    }
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }
}
