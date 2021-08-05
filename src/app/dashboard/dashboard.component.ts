
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ITicket } from '../models/ticket.model';
import { TicketService } from '../services/ticket.services';
import { AppConfiguration } from "read-appsettings-json";
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})

export class DashboardComponent implements OnDestroy, OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  tickets: ITicket[] = [];
  dtTrigger: Subject<any> = new Subject();
  public activos: number = 0;
  public enProgreso: number = 0;
  public terminados: number = 0;
  public responsable: any = {
    nombre: ''
  };
  public isHelpDesk: boolean = AppConfiguration.Setting().isHelpDesk;
  closeResult = '';

  constructor(private ticketService: TicketService,
    private toastr: ToastrService,
    private router: Router,
    private modalService: NgbModal) {
  }

  public ngOnInit(): void {
    this.dtOptions =
    {
      pagingType: 'full_numbers',
      pageLength: 10,
      order: [[ 0, "desc" ]]
    };

    this.ticketService.getTikcets().subscribe(tickets => {
      this.tickets = tickets;

      const activos = this.tickets.filter(t => t.estadoTicket == 1);
      const enProgreso = this.tickets.filter(t => t.estadoTicket == 2);
      const terminados = this.tickets.filter(t => t.estadoTicket == 3);

      this.activos = activos.length;
      this.enProgreso = enProgreso.length;
      this.terminados = terminados.length;
      this.dtTrigger.next();
    });

  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }


  public open(content: any, ticketId: number): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then((result) => {
        const responsable: string = this.responsable.nombre;
        if (responsable.trim().length === 0) {
          this.toastr.warning("El nombre del responsable no puede quedar vacío");
        } else {
          const asignacionticket = {
            Id: ticketId,
            AsignadoA: responsable,
            Errores: ''
          };

          this.ticketService.asignarResponsableTicket(asignacionticket)
            .subscribe(data => {
              this.ticketService.getTikcets().subscribe(tickets => {
                this.tickets = tickets;
                const activos = this.tickets.filter(t => t.estadoTicket == 1);
                const enProgreso = this.tickets.filter(t => t.estadoTicket == 2);
                const terminados = this.tickets.filter(t => t.estadoTicket == 3);

                this.activos = activos.length;
                this.enProgreso = enProgreso.length;
                this.terminados = terminados.length;
                this.rerender();
              })
            })
        }
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        console.log(this.closeResult)
      });
  }


  public openEliminar(content: any, ticketId: number): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then((result) => {

        this.ticketService.deleteTicket(ticketId)
          .subscribe(
            _ => {
              this.ticketService.getTikcets().subscribe(tickets => {
                this.tickets = tickets;
                const activos = this.tickets.filter(t => t.estadoTicket == 1);
                const enProgreso = this.tickets.filter(t => t.estadoTicket == 2);
                const terminados = this.tickets.filter(t => t.estadoTicket == 3);

                this.activos = activos.length;
                this.enProgreso = enProgreso.length;
                this.terminados = terminados.length;
                this.rerender();

                this.toastr.success("El Ticket se ha eliminado correctamente");
              })
            })
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        console.log(this.closeResult)
      });
  }


  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  public redireccionarATicket(ticketId: number): void {
    this.router.navigate(["ticket/seguimiento", ticketId]);
  }

  public editarTicket(ticketId: number): void {
    this.router.navigate(["ticket/ticket/edit", ticketId]);
  }

  public obtenerTipoReporte(tipoReporte: number): string {
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

}

