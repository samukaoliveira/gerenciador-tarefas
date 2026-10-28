import { Tarefa } from './../models/tarefa';
import { Component, Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  tarefas: Tarefa[] = [];

  private readonly API_URL = 'http://localhost:3000/tarefas';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  salvar(tarefa: Tarefa): void{
    this.http.post<Tarefa[]>(this.API_URL, tarefa)
      .subscribe({
        next: (dados) => this.tarefas.push(tarefa),
        error: () => {
          "Erro ao salvar Tarefa.";
        }
      })
  }

  listarTarefas(): Observable<Tarefa[]>{
    return this.http.get<Tarefa[]>(this.API_URL);
  }

  excluirTarefa(id: number): Observable<void>{
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  atualizaConcluido(id: number, concluido: boolean): Observable<void>{
    return this.http.patch<void>(`${this.API_URL}/${id}`, {
      concluido: concluido
    });
  }

}
