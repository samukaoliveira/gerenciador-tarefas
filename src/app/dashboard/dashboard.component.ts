import { Component, OnInit } from '@angular/core';
import { Tarefa } from '../models/tarefa';
import { FormsModule } from '@angular/forms';
import { DashboardService } from './dashboard.service';
import { TipoMensagem } from '../models/tipomensagem';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  tarefas: Tarefa[] = [];
  descricao: string = '';
  concluido: boolean = false;
  data: Date = new Date();
  classificacao: string = '';
  alert: string = "";
  error: string = "";
  total: number = 0;
  concluidos: number = 0;
  percentualBarra: number = 0;
  percentual: number = 0;

  constructor(private service: DashboardService) { }

  ngOnInit(): void {
    this.carregarTarefas();
  }

  adicionar(){
    const novaTarefa: Tarefa = {
      descricao: this.descricao,
      concluido: this.concluido,
      data: this.data,
      classificacao: this.classificacao
    }
    if(!this.validaTarefa(novaTarefa)){
      return false;
    }
    this.service.salvar(novaTarefa);
    this.tarefas.push(novaTarefa);
    this.mostraAlerta("Tarefa Adicionada com sucesso!", TipoMensagem.ALERT);
    this.carregarTarefas();
  }

  validaTarefa(tarefa: Tarefa): boolean{
    if (!tarefa){
      this.mostraAlerta("Tarefa Inválida!");
        console.log(this.error);
      return false;
    }


    if (this.tarefaDuplicada(tarefa)){
        this.mostraAlerta("Tarefa Duplicada!");
        console.log(this.error);
        return false;
    }
    return true;
  }

  tarefaDuplicada(tarefa: Tarefa): boolean{
    return this.tarefas.some(t => t.descricao
          .toLowerCase().trim() === tarefa.descricao.toLowerCase().trim())
  }

  carregarTarefas(){
    return this.service.listarTarefas()
      .subscribe({
        next: (tarefas) => {
          this.tarefas = tarefas;
          this.contarItens();
        },
        error: erro => {
          this.mostraAlerta("Erro ao obter tarefas.");
        }
      });
  }

  excluirTarefa(id: number) {
    this.service.excluirTarefa(id)
      .subscribe({
          next: () => {
            this.tarefas = this.tarefas.filter(t => t.id !== id);
            this.mostraAlerta("Tarefa excluída com sucesso!", TipoMensagem.ALERT);
            this.carregarTarefas();
          },
          error: () => {
            this.mostraAlerta("Não foi possível excluir a tarefa.");
          }
        })
  }

  mostraAlerta(mensagem: string, tipo?: TipoMensagem){

    if(tipo == TipoMensagem.ALERT){
      this.alert = mensagem;
    } else {
      this.error = mensagem;
    }

    setTimeout(() => {
      this.error = '';
      this.alert = '';
    }, 3500);
    console.log("passou do timeout!")
  }

  contarItens(){
    this.total = this.tarefas.length;
    this.concluidos = this.tarefas.filter(
      t => t.concluido == true
    ).length;
    this.percentualBarra = this.concluidos / this.total;
    this.percentual = this.percentualBarra * 100
  }

  atualizaConcluido(id: number, concluido: boolean){
    this.service.atualizaConcluido(id, concluido)
      .subscribe({
        next: () => {
          this.mostraAlerta("Tarefa atualizada com sucesso!", TipoMensagem.ALERT);
          this.carregarTarefas();
        },
        error: () => {
          this.mostraAlerta("Não foi possível atualizar a tarefa.");
        }
      })
  }
}
