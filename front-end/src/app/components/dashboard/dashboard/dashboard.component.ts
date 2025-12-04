import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, registerables } from 'chart.js';
import { Chart } from 'chart.js';
import { AcoesService } from '../../../services/acoes-services.service';
import { RouterLink } from "@angular/router";
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgChartsModule, RouterLink],
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

  // lista de ações do usuário (usada no gráfico e em “Minhas Ações”)
  acoesUsuario: { dia: number; pontos: number; media: number }[] = [];

  // lista de ações do usuário para a LISTAGEM (cards)
  acoesListagem: { tipo: string; dia: number | string; pontos: number }[] = [];

  mostrarMinhasAcoes = false;

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

  constructor(private acoesService: AcoesService) {
    // 🔹 1) DADOS FAKE para o GRÁFICO (não mexe no que aparece)
    const acoesFake = [
      { dia: 26, pontos: 10, media: 8 },
      { dia: 28, pontos: 18, media: 12 },
      { dia: 30, pontos: 25, media: 15 },
      { dia: 1, pontos: 20, media: 17 },
    ];

    this.acoesUsuario = acoesFake;

    this.lineChartData = {
      labels: acoesFake.map((a) => `Dia ${a.dia}`),
      datasets: [
        { ...this.lineChartData.datasets[0], data: acoesFake.map((a) => a.pontos) },
        { ...this.lineChartData.datasets[1], data: acoesFake.map((a) => a.media) },
      ],
    };

    // 🔹 DADOS para a LISTAGEM cards “Minhas Ações”
    this.acoesService.getAcoesUsuario().subscribe((acoes: any[]) => {
      console.log('Dados da listagem:', acoes);

      this.acoesListagem = acoes.map((a) => ({
        tipo: a.tipo_acao ?? 'Ação',
        dia: this.formatarData(a.dia),  // Agora converte corretamente
        pontos: a.pontos ?? 0,
      }));
    });
  }

  formatarData(dia: number | string): string {
  let data: Date;

  // Se for um número (dia do mês)
  if (typeof dia === 'number') {
    const ano = new Date().getFullYear();  // Ano atual
    const mes = new Date().getMonth();  // Mês atual
    data = new Date(ano, mes, dia);  // Cria uma data com o dia
  } 
  // Se for uma string (data completa)
  else if (typeof dia === 'string') {
    data = new Date(dia);  // Converte para Date
  } 
  // Caso não seja válido, coloca um fallback
  else {
    return 'Data inválida';
  }

  // Ajuste para o fuso horário local
  const localDate = new Date(data.getTime() - data.getTimezoneOffset() * 60000); // Converte para o horário local

  return `${localDate.getDate().toString().padStart(2, '0')}/${(localDate.getMonth() + 1).toString().padStart(2, '0')}/${localDate.getFullYear()}`;
}


  toggleMinhasAcoes() {
    this.mostrarMinhasAcoes = !this.mostrarMinhasAcoes;
  }
}
