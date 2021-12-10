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
/*
AUX
export class Atributo{
    identificador:string;
    valor:string;
    linea: number;
    columna: number;

    constructor(id:string, valor:string, linea:number, columna:number){
        this.identificador = id;
        this.valor = valor;
        this.linea = linea;
        this.columna = columna;
    }
}
*/