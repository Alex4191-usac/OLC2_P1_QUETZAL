export class Parametro {

    tipo: string;
    identificador: string;
    fila: number;
    columna: number;

    constructor(tipo: string, identificador: string,  fila: number, columna: number) {
        this.tipo = tipo;
        this.identificador = identificador;
        this.fila = fila;
        this.columna = columna;
    }


}