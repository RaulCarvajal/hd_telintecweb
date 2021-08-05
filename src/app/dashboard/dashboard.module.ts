import { CommonModule } from "@angular/common";
import { DashboardComponent } from "./dashboard.component";
import { DashboardRoutes } from "./dashboard.routing";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, DataTablesModule,  FormsModule, RouterModule.forChild(DashboardRoutes)],
  declarations: [DashboardComponent]
})
export class DashboardModule {}
