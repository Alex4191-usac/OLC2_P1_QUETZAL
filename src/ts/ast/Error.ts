export class Errores {

    fila: number;
    columna: number;
    tipo: string;
    descripcion: string;
    ambito: string;

    constructor(tipo: string, descripcion: string, fila: number, columna: number, ambito: string) {
        this.tipo = tipo;
        this.descripcion = descripcion;
        this.ambito = ambito;
        this.fila = fila;
        this.columna = columna;
    }
}