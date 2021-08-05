
import { Routes } from "@angular/router";
import { AltaComponent } from "./alta/alta.component";
import { SeguimientoComponent } from "./seguimiento/seguimiento.component";

export const TicketsRoutes: Routes = [
    {
        path: "",
        children: [
            {
                path: "",
                component: AltaComponent,
                data: {
                    heading: "Nuevo Ticket"
                  }
            },
            {
                path: "ticket/edit/:ticketId",
                component: AltaComponent,
                data: {
                    heading: "Editar Ticket"
                  }
            },
            {
                path: "seguimiento/:ticketId",
                component: SeguimientoComponent,
                data: {
                    heading: "Seguimiento Ticket"
                  }
            }
        ]
    }
];
