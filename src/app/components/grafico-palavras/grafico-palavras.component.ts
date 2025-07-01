import { Component, ViewChild } from '@angular/core';
import { ApexNonAxisChartSeries, ApexChart, ApexResponsive, ApexTitleSubtitle, ApexAxisChartSeries, ApexXAxis, ApexStroke, ApexDataLabels, ApexMarkers, ApexYAxis, ApexGrid, ApexFill, ChartComponent } from 'ngx-apexcharts';
import { DashboardService } from 'src/app/services/dashboard.service';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  responsive: ApexResponsive[];
  title?: ApexTitleSubtitle;
};

export type LineChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke?: ApexStroke;
  dataLabels?: ApexDataLabels;
  markers?: ApexMarkers;
  yaxis?: ApexYAxis;
  title?: ApexTitleSubtitle;
  grid?: ApexGrid;
  fill?: ApexFill;
};


@Component({
  selector: 'app-grafico-palavras',
  templateUrl: './grafico-palavras.component.html',
  styleUrls: ['./grafico-palavras.component.scss']
})

export class GraficoPalavrasComponent {
 @ViewChild('chart') chart!: ChartComponent;

  // public pieChartOptions: Partial<ChartOptions> = {};
  // public lineChartOptions: Partial<LineChartOptions> = {};
  
  public pieChartOptions: {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    labels: string[];
    responsive: ApexResponsive[];
    title: ApexTitleSubtitle;
  } = {
    series: [],
    chart: { type: 'pie', height: 360 },
    labels: [],
    responsive: [],
    title: { text: '', align: 'center' }
  };

  public lineChartOptions: {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    stroke: ApexStroke;
    dataLabels: ApexDataLabels;
    title: ApexTitleSubtitle;
  } = {
    series: [
      {
        name: '',
        data: []
      }
    ],
    chart: { type: 'line', height: 360 },
    xaxis: { categories: [] },
    stroke: { curve: 'smooth' },
    dataLabels: { enabled: true },
    title: { text: '', align: 'center' }
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getPalavrasMaisBuscadas().subscribe(data => {
      const labels = data.map(item => this.toPascalCase(item.keyword));
      const values = data.map(item => item.count);

      this.pieChartOptions = {
        series: values,
        chart: {
          type: 'pie',
          height: 360
        },
        labels: labels,
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 300
              },
              legend: {
                position: 'bottom'
              }
            }
          }
        ],
        title: {
          text: 'Palavras mais buscadas - Distribuição',
          align: 'center'
        }
      };

      this.lineChartOptions = {
        series: [
          {
            name: 'Buscas',
            data: values
          }
        ],
        chart: {
          height: 360,
          type: 'line',
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: true
        },
        stroke: {
          curve: 'smooth'
        },
        xaxis: {
          categories: labels
        },
        title: {
          text: 'Palavras mais buscadas - Tendência',
          align: 'center'
        }
      };
    });
  }

  private toPascalCase(value: string): string {
    return value
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  }
}

