export class Processo {
    id: number | undefined;
    npu: string;
    dataCadastro: string | undefined;
    dataVisualizacao: string | undefined;
    uf: string;
    municipio: string;
    // pdfDocumento: Blob | undefined;

    constructor(id: number | null, npu: string | null, uf: string | null, municipio: string | null
        // ,pdfDocumento: Blob | undefined
    ) {
        this.id = id ? id : undefined;
        this.npu = npu ? npu : '';
        this.uf = uf ? uf : '';
        this.municipio = municipio ? municipio : '';
        // this.pdfDocumento = pdfDocumento ? pdfDocumento : undefined;
    }

}