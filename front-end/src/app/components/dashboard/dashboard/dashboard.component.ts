import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { RouterLink } from "@angular/router";
import { AcoesService } from '../../../services/acoes-services.service';


Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements AfterViewInit {

  @ViewChild('lineCanvas') lineCanvas!: ElementRef<HTMLCanvasElement>;

  public cards = [
    { title: 'Pontuação Total', value: '120 pts', icon: 'bi bi-lightning-charge', color: '#2ecc71' },
    { title: 'Ações no mês', value: '35', icon: 'bi bi-cloud-check', color: '#3498db' },
    { title: 'Média semanal', value: '245 pts', icon: 'bi bi-star', color: '#f1c40f' },
    { title: 'CO₂ resgatado', value: 245, icon: 'bi bi-tree', color: '#000080' },
  ];

  acoesUsuario: { dia: number; pontos: number; media: number }[] = [];
  acoesListagem: { tipo: string; dia: string; pontos: number }[] = [];
  mostrarMinhasAcoes = false;

  private chart!: Chart;

  constructor(private acoesService: AcoesService) {

    // DADOS FAKE (APENAS PARA EXIBIÇÃO)
    const acoesFake = [
      { dia: 26, pontos: 10, media: 8 },
      { dia: 28, pontos: 18, media: 12 },
      { dia: 30, pontos: 25, media: 15 },
      { dia: 1, pontos: 20, media: 17 },
    ];

    this.acoesUsuario = acoesFake;

    // BUSCA AÇÕES DO BACK-END
    this.acoesService.getAcoesUsuario().subscribe((acoes: any[]) => {
      this.acoesListagem = acoes.map((a) => ({
        tipo: a.tipo_acao ?? 'Ação',
        dia: this.formatarData(a.dia),
        pontos: a.pontos ?? 0,
      }));
    });
  }

  // RENDERIZA O GRÁFICO APÓS A VIEW CARREGAR
  ngAfterViewInit() {
    this.criarGrafico();
  }

  criarGrafico() {
    const ctx = this.lineCanvas.nativeElement.getContext('2d');

    if (!ctx) return;

    if (this.chart) this.chart.destroy();

    this.chart = new Chart(ctx, {
      type: 'bar', // GRÁFICO DE BARRAS
      data: {
        labels: this.acoesUsuario.map(a => `Dia ${a.dia}`),
        datasets: [
          {
            label: 'Pontos Ganhos',
            data: this.acoesUsuario.map(a => a.pontos),
            backgroundColor: 'rgba(52, 152, 219, 0.6)',
            borderColor: 'rgba(52, 152, 219, 1)',
            borderWidth: 1,
          },
          {
            label: 'Média Geral',
            data: this.acoesUsuario.map(a => a.media),
            backgroundColor: 'rgba(46, 204, 113, 0.6)',
            borderColor: 'rgba(46, 204, 113, 1)',
            borderWidth: 1,
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  // FORMATA DATA PARA DIA/MÊS/ANO
  formatarData(data: any): string {
    const d = new Date(data);
    return d.toLocaleDateString('pt-BR');
  }

  // EVITA ERRO DO TEMPLATE
  toggleMinhasAcoes() {
    this.mostrarMinhasAcoes = !this.mostrarMinhasAcoes;
  }
}
