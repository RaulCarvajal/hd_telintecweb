import { AdminLayoutComponent } from "./core";
import { AuthLayoutComponent } from "./core";
import { Routes } from "@angular/router";
import { KpisComponent } from "./kpis/kpis.component";

export const AppRoutes: Routes = [
  {
    path: "",
    component: AdminLayoutComponent,
    children: [
      {
        path: "",
        loadChildren: () =>
          import("./dashboard/dashboard.module").then(m => m.DashboardModule)
      },
      {
        path: "docs",
        loadChildren: () => import("./docs/docs.module").then(m => m.DocsModule)
      },
      {
        path: "ticket",
        loadChildren: () =>
          import("./tickets/tickets.module").then(
            m => m.TicketsModule
          )
      },
      {
        path : "dashboard",
        component : KpisComponent
      }
    ]
  },
  {
    path: "",
    component: AuthLayoutComponent,
    children: [
    
      {
        path: "error",
        loadChildren: () =>
          import("./error/error.module").then(m => m.ErrorModule)
      }
    ]
  },
  {
    path: "**",
    redirectTo: "error/404"
  }
];
