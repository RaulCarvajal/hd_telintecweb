import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AltaComponent } from "./alta/alta.component";
import { TicketsRoutes } from "./tickets.routting";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SeguimientoComponent } from "./seguimiento/seguimiento.component";


@NgModule({
  imports: [CommonModule, FormsModule, RouterModule.forChild(TicketsRoutes), ReactiveFormsModule],
  declarations: [AltaComponent, SeguimientoComponent]
})
export class TicketsModule {}
