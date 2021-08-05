import { CommonModule } from "@angular/common";
import { DocsComponent } from "./docs.component";
import { DocsRoutes } from "./docs.routing";
import { NgModule } from "@angular/core";
import { NgbAccordionModule } from "@ng-bootstrap/ng-bootstrap";
import { RouterModule } from "@angular/router";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(DocsRoutes),
    NgbAccordionModule
  ],
  declarations: [DocsComponent]
})
export class DocsModule {}
