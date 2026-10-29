import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-paginacao',
  templateUrl: './paginacao.component.html',
  styleUrls: ['./paginacao.component.scss']
})
export class PaginacaoComponent<T> implements OnChanges {
  @Input() itens: T[] = [];
  @Input() itensPorPagina = 5;
  @Input() comparator?: (a: T, b: T) => number;

  @Output() itensVisiveisChange = new EventEmitter<T[]>();

  paginaAtual = 0;

  get ultimaPagina(): number {
    return Math.max(0, Math.ceil(this.itens.length / this.itensPorPagina) - 1);
  }

  get podePrimeiro(): boolean { return this.paginaAtual > 0; }
  get podePrev(): boolean { return this.paginaAtual > 0; }
  get podeNext(): boolean { return this.paginaAtual < this.ultimaPagina; }
  get podeUltimo(): boolean { return this.paginaAtual < this.ultimaPagina; }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['itens'] || changes['itensPorPagina'] || changes['comparator']) {
      this.paginaAtual = Math.min(this.paginaAtual, this.ultimaPagina);
      this.emitirItensVisiveis();
    }
  }

 private ordenarItens(): T[]{
    const itens = [...this.itens];

    if (this.comparator) {
      itens.sort(this.comparator);
    }
    return itens;
  }

  private emitirItensVisiveis(): void {
    const inicio = this.paginaAtual * this.itensPorPagina;
    const itensOrdenados = this.ordenarItens();

    this.itensVisiveisChange.emit(
      itensOrdenados.slice(
        inicio,
        inicio + this.itensPorPagina
      )
    );
  }

  private irPara(pagina: number): void {
    this.paginaAtual = pagina;
    this.emitirItensVisiveis();
  }


  firstPage(): void {
    if (this.podePrimeiro) this.irPara(0);
  }

  prevPage(): void {
    if (this.podePrev) {
      this.irPara(this.paginaAtual - 1);
    }
  }

  nextPage(): void {
    if (this.podeNext) {
      this.irPara(this.paginaAtual + 1);
    }
  }

  lastPage(): void {
    if (this.podeUltimo) this.irPara(this.ultimaPagina);
  }
}
