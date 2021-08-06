import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { IPlanta } from '../models/planta.model';
import { ITicket } from '../models/ticket.model';
import { TicketService } from '../services/ticket.services';
import { planta_incidencia, tipos_reporte, tr_incidencia } from './kpis.interface';

@Component({
  selector: 'app-kpis',
  templateUrl: './kpis.component.html',
  styleUrls: ['./kpis.component.css']
})
export class KpisComponent implements OnInit {

  tickets: ITicket[] = [];
  plantas: IPlanta[] = [];
  tipos_reporte:tipos_reporte[] = [
    { tipoReporte : 1, tipo : "Error en Sistema"},
    { tipoReporte : 2, tipo : "Falla en Equipo"},
    { tipoReporte : 3, tipo : "Mantenimiento"},
    { tipoReporte : 4, tipo : "Otro"}
  ];
  planta_incidencia:planta_incidencia[]=[];
  tr_incidencias:tr_incidencia[] = [];
  tiempos_respuesta:number[] = [];
  activos:number = 0;
  enProgreso:number = 0;
  terminados:number = 0;
  trpromedio:string = "";
  trmenor:string = "";
  trmayor:string = "";

  constructor(
    private ts:TicketService
  ) { }

  ngOnInit(): void {
    this.getTickets();
  }

  getTickets(){
    this.ts.getTikcets().subscribe(
      res=>{
        this.tickets = res;
        this.activos = this.tickets.filter(t => t.estadoTicket == 1).length;
        this.enProgreso = this.tickets.filter(t => t.estadoTicket == 2).length;
        this.terminados = this.tickets.filter(t => t.estadoTicket == 3).length;
        this.getPlantas();
        this.getTiemposRespuesta();
      }
    );
  }

  getPlantas(){
    this.ts.getPlantas().subscribe(
      res => {
        this.plantas = res;
        setTimeout(() => {
          this.getPlantaIncidencias();
          this.getTiposIncidencias();
        }, 1000);
      }
    )
  }

  getPlantaIncidencias(){
    this.plantas.forEach(planta => {
      this.planta_incidencia.push({
        id_planta : planta.plantaId,
        planta : planta.plantaNombre,
        incidencias : this.tickets.filter(t=> t.plantaId == planta.plantaId).length
      })
    })
    this.planta_incidencia.sort((a, b) => (a.incidencias < b.incidencias) ? 1 : -1);
  }

  getTiposIncidencias(){
    this.tipos_reporte.forEach(o => {
      this.tr_incidencias.push({
        tipoReporte : o.tipoReporte,
        tipo : o.tipo,
        incidencias : this.tickets.filter(t=> t.tipoReporte == o.tipoReporte).length
      })
      this.pieChartLabels.push(o.tipo);
      this.pieChartData.push(this.tickets.filter(t=> t.tipoReporte == o.tipoReporte).length);
    })
    this.tr_incidencias.sort((a, b) => (a.incidencias < b.incidencias) ? 1 : -1);
  }

  getTiemposRespuesta(){
    let tt:ITicket[] = this.tickets.filter(e => e.estadoTicket == 3);
    tt.forEach( t => {
      this.tiempos_respuesta.push(Math.abs(new Date(t.fechaTermino).getTime()-new Date(t.fechaAlta).getTime())) //Milisegundos
    })
    let sumavg:number = 0;
    this.tiempos_respuesta.forEach( t => {
      sumavg+=t;
    })
    this.tiempos_respuesta.sort((a,b) => (a<b)? 1:-1);
    let travg = Math.round(sumavg/this.tiempos_respuesta.length);
    this.trpromedio = this.getDateDiffString(travg);
    this.trmayor = this.getDateDiffString(this.tiempos_respuesta[0]);
    this.trmenor = this.getDateDiffString(this.tiempos_respuesta[this.tiempos_respuesta.length-1]);
  }

  getDateDiffString(mlsdff:number):string{
    var dias = Math.floor(mlsdff / 86400000);
    var horas = Math.floor((mlsdff % 86400000) / 3600000);
    var minutos = Math.round(((mlsdff % 86400000) % 3600000) / 60000);
    let ds=dias?dias + " días, ":"";
    let hs=horas?horas + " horas, ":"";
    return ds + hs + minutos + " minutos";
  }

  /** */
  public pieChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio : false,
    legend: {
      position: 'bottom',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };
  public pieChartLabels: Label[] = [];
  public pieChartData: number[] = [];
  public pieChartType: ChartType = 'doughnut';
  public pieChartLegend = true;
  public pieChartColors = [
    {
      backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)','rgba(200,200,200,0.7)'],
    },
  ];
  /** */
}
