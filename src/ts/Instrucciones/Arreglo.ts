import {AST} from "../ast/AST"
import { Entorno } from "../ast/Entorno"
import { Instruccion } from "../interfaces/Instruccion" 
import { Expresion } from "../interfaces/Expresion"
export class Arreglo implements Instruccion {
    
    nombreFuncion: string;
    expresion: Expresion[];
    fila: number;
    columna: number;
    
    constructor(nombreFuncion: string, expresion: Expresion[], fila: number, columna: number ) {
        this.nombreFuncion = nombreFuncion;
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