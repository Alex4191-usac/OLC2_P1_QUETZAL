import { Expresion } from "../interfaces/Expresion";


export class Rango  {

    idArreglo: string;
    rangoInicio: Expresion;
    rangoFinal: Expresion;
    fila: number;
    columna: number;

    constructor(idArreglo: string, rangoInicio: Expresion, rangoFinal: Expresion, fila: number, columna: number) {
        this.idArreglo = idArreglo;
        this.rangoInicio = rangoInicio;
        this.rangoFinal = rangoFinal;
        this.fila = fila;
        this.columna = columna;

    }
}