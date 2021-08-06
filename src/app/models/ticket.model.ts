export interface ITicket {
    ticketId: number,
    plantaId: number,
    tipoReporte : number,
    estadoTicket: number,
    nombreReporta: string,
    compentarioAlta: string,
    asignadoA : string,
    fechaAlta: Date,
    fechaAsignado: Date,
    fechaTermino: Date,
    comentarioAsignado: string;
    planta: string;
}
