import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Ticket } from '../../models/ticket-class.model';
import { TicketService } from '../../services/ticket.services';
import { AppConfiguration } from "read-appsettings-json";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    templateUrl: './seguimiento.component.html',
    styleUrls: ["./seguimiento.component.scss"]
})

export class SeguimientoComponent implements OnInit, OnDestroy {

    private sub: any;
    public ticketId: number;
    public ticket: Ticket;
    public altaForm: FormGroup;
    public estadoTicket: number;
    public isHelpDesk: boolean = AppConfiguration.Setting().isHelpDesk;
    public _image: any;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private toastr: ToastrService,
        private domSanitizer: DomSanitizer,
        private ticketService: TicketService) {
        this.ticket = new Ticket();
        this.createTicketForm();
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.ticketId = +params['ticketId'];
            this.ticketService.getTicketPorId(this.ticketId)
                .subscribe(ticket => {
                    this.ticket = ticket;
                    this.createTicketForm();
                    console.log(this.ticket);
                    this._image = this.ticket.imagenUrl;
                    this.estadoTicket = this.ticket.estadoTicket;


                  this.ticketService.getTicketImage(this.ticketId).subscribe(
                    ticket => {
                      if (ticket.imagen) {
                        let objectURL = 'data:image/jpeg;base64,' + ticket.imagenData;
                        this._image = this.domSanitizer.bypassSecurityTrustUrl(objectURL);

                      }
                    }
                  )
                });
        });
    }

    private createTicketForm(): void {
        this.altaForm = this.fb.group({
            NombreReporta: [this.ticket.nombreReporta, Validators.required],
            TipoReporte: [this.obtenerTipoReporte(this.ticket.tipoReporte), Validators.required],
            ComentarioAlta: [this.ticket.comentarioAlta, Validators.required],
            FechaAlta: [this.ticket.fechaAlta],
            AsignadoA: [this.ticket.asignadoA],
            FechaAsignadio: [this.ticket.fechaAsignado],
            ComentarioAsignado: [this.ticket.comentarioAsignado, Validators.required],
            CerrarTicket: [this.ticket.cerrarTicket],
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    private obtenerTipoReporte(tipoReporte: number): string {
        switch (tipoReporte) {
            case 1:
                return "Error en Sistema";
            case 2:
                return "Falla en Equipo";
            case 3:
                return "Mantenimiento";
            default:
                return "Otro";
        }
    }

    public Cancelar(): void {
        this.router.navigate(["/"]);
    }

    public onSubmit(): void {
        const ticketAlta = Object.assign({}, this.altaForm.value);
        const newTicket = { ...ticketAlta, Errores: "" };

        const cerrarTicketModel = {
            Id: this.ticketId,
            ComentarioAsignado: newTicket.ComentarioAsignado,
            CerrarTicket: newTicket.CerrarTicket == null ? false : newTicket.CerrarTicket
        };

        this.ticketService.cerrarTicket(cerrarTicketModel)
            .subscribe(
                ticket => {
                    if (newTicket.CerrarTicket) {
                        this.toastr.success("El ticket se ha cerrado con éxito");
                        this.Cancelar();
                    }
                    else
                    {
                        this.toastr.success("El ticket se ha actualizado con éxito");
                    }
                },
                error => {
                    this.toastr.error("Hubo un error al querer actualizar el ticket " + error.title || error);
                }
            );
    }
}
