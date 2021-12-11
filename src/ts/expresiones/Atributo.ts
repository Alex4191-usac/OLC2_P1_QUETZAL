export class Atributo {

    tipo: string;
    identificador: string;
    valor: string;
    fila: number;
    columna: number;

    constructor(tipo: string,identificador: string, valor: string, fila: number, columna: number) {
        this.tipo = tipo;
        this.identificador = identificador;
        this.valor = valor;
        this.fila = fila;
        this.columna = columna;
    }
    
}