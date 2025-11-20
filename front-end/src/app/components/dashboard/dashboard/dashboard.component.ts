import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import {
  ChartConfiguration,
  ChartOptions,
  registerables,
} from 'chart.js';
import { Chart } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements AfterViewInit {
  public cards = [
    {
      title: 'Pontuação Total',
      value: '120 pt',
      icon: 'bi bi-lightning-charge',
      color: '#2ecc71',
    },
    {
      title: 'Ações no mês',
      value: '35',
      icon: 'bi bi-cloud-check',
      color: '#3498db',
    },
    {
      title: 'Média semanal',
      value: '245 pts',
      icon: 'bi bi-star',
      color: '#f1c40f',
    },
    {
      title: 'CO₂ resgatado',
      value: 245,
      icon: 'bi bi-tree',
      color: '#000080',
    },
  ];

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['7', '8', '9', '10', '11', '12', '13'],
    datasets: [
      {
        label: 'Você',
        data: [10, 25, 30, 28, 40, 55, 70],
        tension: 0.35,
        fill: 'start',
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, 'rgba(46,204,113,0.28)');
          gradient.addColorStop(1, 'rgba(46,204,113,0)');
          return gradient;
        },
        borderColor: '#2ecc71',
        pointRadius: 4,
        pointBackgroundColor: '#2ecc71',
        borderWidth: 3,
      },
      {
        label: 'Média da Comunidade',
        data: [8, 20, 22, 30, 35, 45, 60],
        tension: 0.35,
        fill: 'start',
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, 'rgba(54,162,235,0.18)');
          gradient.addColorStop(1, 'rgba(54,162,235,0)');
          return gradient;
        },
        borderColor: '#3aa0ff',
        pointRadius: 4,
        pointBackgroundColor: '#3aa0ff',
        borderWidth: 3,
      },
    ],
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#6b7280' } },
      y: {
        grid: { color: 'rgba(200,200,200,0.12)' },
        ticks: { color: '#6b7280' },
        beginAtZero: true,
      },
    },
  };

  public lineChartType: any = 'line';



  ngAfterViewInit(): void {
    const defaults: any = Chart.defaults;
    defaults.scale = defaults.scale || {};
    defaults.scale.border = defaults.scale.border || {};
    defaults.scale.border.display = false;
  }
}
