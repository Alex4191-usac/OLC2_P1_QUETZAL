import {AST} from "../ast/AST"
import { Entorno } from "../ast/Entorno"
import { Instruccion } from "../interfaces/Instruccion" 
import { Expresion } from "../interfaces/Expresion"
import { Errores } from '../ast/Error';
import { Simbolo } from "../ast/Simbolo";
export class ForEach implements Instruccion {
    expresion: Expresion;
    expresion2: Expresion;
    listaInstrucciones: any[];
    fila: number;
    columna: number;

    // for letra in cadena 
    constructor(expresion: Expresion, expresion2: Expresion, listaInstrucciones: any[],fila: number, columna: number) {
        this.expresion = expresion;
        this.expresion2 = expresion2;
        this.listaInstrucciones = listaInstrucciones;
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