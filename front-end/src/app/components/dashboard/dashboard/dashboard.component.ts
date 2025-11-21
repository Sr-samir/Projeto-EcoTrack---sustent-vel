import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, registerables } from 'chart.js';
import { Chart } from 'chart.js';
import { AcoesService } from '../../../services/acoes-services.service';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  public cards = [
    { title: 'Pontuação Total', value: '120 pt', icon: 'bi bi-lightning-charge', color: '#2ecc71' },
    { title: 'Ações no mês', value: '35', icon: 'bi bi-cloud-check', color: '#3498db' },
    { title: 'Média semanal', value: '245 pts', icon: 'bi bi-star', color: '#f1c40f' },
    { title: 'CO₂ resgatado', value: 245, icon: 'bi bi-tree', color: '#000080' },
  ];

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Você',
        data: [],
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
        data: [],
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
    plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#6b7280' } },
      y: { grid: { color: 'rgba(200,200,200,0.12)' }, ticks: { color: '#6b7280' }, beginAtZero: true },
    },
  };

  public lineChartType: any = 'line';

  constructor(private acoesService: AcoesService) {
    // buscar os dados do backend assim que o componente for criado
    this.acoesService.getAcoesUsuario().subscribe((acoes: any[]) => {
      console.log('Dados recebidos do backend:', acoes);

      if (acoes.length > 0) {
        // Cria um novo objeto para disparar a detecção de mudanças
        this.lineChartData = {
          labels: acoes.map(a => a.dia.toString()),
          datasets: [
            {
              ...this.lineChartData.datasets[0],
              data: acoes.map(a => a.pontos),
            },
            {
              ...this.lineChartData.datasets[1],
              data: acoes.map(a => a.media || 0),
            },
          ],
        };
      }
    });
  }
}