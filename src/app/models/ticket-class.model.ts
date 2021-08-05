export class Ticket {
    public ticketId: number;
    public tipoReporte: number;
    public estadoTicket: number;
    public nombreReporta: string;
    public comentarioAlta: string;
    public planta : string;
    public asignadoA: string;
    public fechaAlta: Date;
    public fechaAsignado: Date;
    public fechaTermino: Date;
    public comentarioAsignado: string;
    public cerrarTicket : boolean;
    public imagenUrl : string;

    constructor() {
        this.ticketId = undefined;
        this.tipoReporte = undefined;
        this.estadoTicket = undefined;
        this.nombreReporta = undefined;
        this.comentarioAlta = undefined;
        this.asignadoA = undefined;
        this.fechaAlta = undefined;
        this.fechaAsignado = undefined;
        this.fechaTermino = undefined;
        this.comentarioAsignado = undefined;
        this.cerrarTicket = undefined
        this.planta = undefined;
        this.imagenUrl = undefined;
    }
}
