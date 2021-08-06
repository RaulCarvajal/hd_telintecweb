import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { IPlanta } from "../../models/planta.model";
import { TicketAlta } from "../../models/ticket-alta.model";
import { TicketService } from "../../services/ticket.services";
import { DomSanitizer } from '@angular/platform-browser';
import { Archivo } from "src/app/models/archivo.model";
import { ImageService } from "src/app/services/image.service";
@Component({

  templateUrl: "./alta.component.html",
  styleUrls: ["./alta.component.scss"]
})

export class AltaComponent implements OnInit {

  public altaForm: FormGroup;
  public altaTicket: TicketAlta;
  private sub: any;
  public ticketId: number;
  private isUpdate: boolean = false;
  public plantas: IPlanta[];
  public selectedFile: File = null;
  public imageName: string;
  public eliminar: boolean = false;
  public _image: any;
  public archivo: Archivo;

  constructor(
    private fb: FormBuilder,
    private ticketService: TicketService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private imageService: ImageService,
    private domSanitizer: DomSanitizer
  ) {
    this.altaTicket = new TicketAlta();
    this.createForm();
  }

  createForm() {
    this.altaForm = this.fb.group({
      NombreReporta: [this.altaTicket.NombreReporta, Validators.required],
      TipoReporte: [this.altaTicket.TipoReporte, Validators.required],
      ComentarioAlta: [this.altaTicket.ComentarioAlta, Validators.required],
      PlantaId: [this.altaTicket.PlantaId, Validators.required],
      Imagen: [""]
    });
  }

  ngOnInit(): void {

    this.ticketService.getPlantas().subscribe(plantas => {
      this.plantas = plantas;
    })


    this.sub = this.route.params.subscribe(params => {
      this.ticketId = +params['ticketId'];
      if (this.ticketId) {
        this.ticketService.getTicketPorId(this.ticketId)
          .subscribe(ticket => {
            this.altaTicket = new TicketAlta();
            this.altaTicket.NombreReporta = ticket.nombreReporta;
            this.altaTicket.TipoReporte = ticket.tipoReporte;
            this.altaTicket.ComentarioAlta = ticket.comentarioAlta;
            this.altaTicket.PlantaId = ticket.plantaId;
            this.isUpdate = true;

            this.ticketService.getTicketImage(this.ticketId).subscribe(
              ticket => {
                if (ticket.imagen){
                  this.altaForm.controls["Imagen"].setValue(ticket.imagen);
                  let objectURL = 'data:image/jpeg;base64,' + ticket.imagenData;
                  this._image = this.domSanitizer.bypassSecurityTrustUrl(objectURL);
                  this.eliminar = true;
                }
              }
            )

            this.createForm();
          });
      }
    });
  }

  public onSubmit(): void {
    const ticketAlta = Object.assign({}, this.altaForm.value);
    const fd = new FormData();

    if (this.selectedFile) {
      fd.append('File', this.selectedFile);
    }

    if (!this.isUpdate) {
      const newTicket = { ...ticketAlta, Errores : "", TipoReporte : +ticketAlta.TipoReporte, PlantaId : +ticketAlta.PlantaId };
      fd.append('TicketAlta', JSON.stringify(newTicket));
      this.ticketService.altaTicket(fd)
        .subscribe(
          ticket => {
            this.toastr.success("El ticket se ha generado con éxito");
            this.cancelTicket();
          },
          error => {
            this.toastr.error("Hubo un error al querer crear el ticket " + error.title || error);
          }
        )
    }
    else {
      const newTicket = { ...ticketAlta, Errores: "", Id: this.ticketId, PlantaId: +ticketAlta.PlantaId };
      fd.append('TicketUpdate', JSON.stringify(newTicket));
      console.log(newTicket)
      this.ticketService.updateTicket(fd)
        .subscribe(
          ticket => {
            this.toastr.success("El ticket se ha actualizado con éxito");
            this.router.navigate(["/"]);
          },
          error => {
            this.toastr.error("Hubo un error al querer crear el ticket " + error.title || error);
          }
        )
    }

  }

  public cancelTicket(): void {
    if (this.isUpdate) {
      this.router.navigate(["/"]);
    }
    else {
      this.altaTicket = new TicketAlta();
      this._image = null;
      this.altaForm.reset(this.altaTicket);
    }
  }

  public async onFileClientSelected(event) {
    this.selectedFile = <File>event.target.files[0];
    this.imageName = this.selectedFile.name;
    this.altaForm.controls["Imagen"].setValue(this.imageName);
    this.eliminar = true;

    const reader = new FileReader();
    reader.onload = async () => {
      this._image = reader.result as string;
    };
    reader.readAsDataURL(this.selectedFile);
  }

  public eliminarImagen(): void {
    this.selectedFile = null;
    this.eliminar = false;
    this.altaForm.controls["Imagen"].setValue("");
  }
}
