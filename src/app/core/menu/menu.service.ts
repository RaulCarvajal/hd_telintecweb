import { Injectable } from "@angular/core";
import { AppConfiguration } from "read-appsettings-json";

export interface BadgeItem {
  type: string;
  value: string;
}

export interface ChildrenItems {
  state: string;
  name: string;
  type?: string;
}

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
  badge?: BadgeItem[];
  children?: ChildrenItems[];
}

const MENUITEMSHD = [
  {
    state: "/",
    name: "Inicio",
    type: "link",
    icon: "basic-accelerator"
  },
  {
    state: "ticket",
    name: "Alta Ticket",
    type: "link",
    icon: "basic-archive",
  },
  {
    state: "seguimientoticket",
    name: "Seguimiento Ticket",
    type: "link",
    icon: "basic-archive-full",
  }
];

const MENUITEMSUSER = [
  {
    state: "/",
    name: "Inicio",
    type: "link",
    icon: "basic-accelerator"
  },
  {
    state: "ticket",
    name: "Alta Ticket",
    type: "link",
    icon: "basic-archive",
  }
];

@Injectable()
export class MenuService {

  private isHelpDesk : boolean = AppConfiguration.Setting().isHelpDesk;

  getAll(): Menu[] {
    return this.isHelpDesk ?  MENUITEMSUSER : MENUITEMSUSER;
  }
}
