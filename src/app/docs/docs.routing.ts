import { DocsComponent } from "./docs.component";
import { Routes } from "@angular/router";

export const DocsRoutes: Routes = [
  {
    path: "",
    component: DocsComponent,
    data: {
      heading: "Documentation"
    }
  }
];
