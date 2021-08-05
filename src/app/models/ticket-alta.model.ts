export class TicketAlta {
    public TipoReporte : number;
    public NombreReporta : string;
    public ComentarioAlta : string;
    public Errores: string;
    public PlantaId : number;
    public File : any;

    constructor() {
        this.TipoReporte = 1;
        this.NombreReporta = undefined;
        this.ComentarioAlta =undefined;
        this.Errores = undefined;
        this.PlantaId = 1;
        this.File= undefined;
    }
}


export class FileToUpload {
  fileName: string = "";
  fileSize: number = 0;
  fileType: string = "";
  lastModifiedTime: number = 0;
  lastModifiedDate: Date = null;
  fileAsBase64: string = "";
}
