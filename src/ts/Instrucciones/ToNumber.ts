import {AST} from "../ast/AST"
import { Entorno } from "../ast/Entorno"
import { Instruccion } from "../interfaces/Instruccion" 
import { Expresion } from "../interfaces/Expresion"
import { Errores } from '../ast/Error';
import { Simbolo } from "../ast/Simbolo";
export class ToNumber implements Instruccion {

    funcion: string;
    expresion: Expresion;
    fila: number;
    columna: number;

    constructor(funcion: string,expresion: Expresion,fila: number, columna: number){
        this.funcion = funcion;
        this.expresion = expresion;
        this.fila = fila;
        this.columna = columna;
    }
    
    ejecutar(ent: Entorno, arbol: AST, errores: any, imprimir: any) {
        throw new Error("Method not implemented.");
    }
    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }


}