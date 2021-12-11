import {AST} from "../ast/AST"
import { Entorno } from "../ast/Entorno"
import { Instruccion } from "../interfaces/Instruccion" 
import { Expresion } from "../interfaces/Expresion"
import { Errores } from '../ast/Error';
import { Simbolo } from "../ast/Simbolo";

export class Substring implements Instruccion {

    expresion1: Expresion;
    expresion2: Expresion;
    fila: number;
    columna: number;

    constructor(expresion1: Expresion, expresion2: Expresion, fila: number, columna: number) {

        this.expresion1 = expresion1;
        this.expresion2 = expresion2;
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