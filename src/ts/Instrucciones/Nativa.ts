import { AST } from '../ast/AST';
import { Entorno } from '../ast/Entorno';
import { Expresion } from '../interfaces/Expresion';
import { Instruccion } from '../interfaces/Instruccion';

export class Nativa implements Instruccion {

    funcion: string;
    argumentos: Expresion[];
    fila: number;
    columna: number;

    constructor(funcion: string, argumentos: Expresion[], fila: number, columna: number) {
        this.funcion = funcion;
        this.argumentos = argumentos;
        this.fila = fila;
        this.columna = columna;
    }

    ejecutar(ent: Entorno, arbol: AST, errores: any, imprimir: any) {
        throw new Error('Method not implemented.');
    }
    traducir(ent: Entorno, arbol: AST) {
        throw new Error('Method not implemented.');
    }
}