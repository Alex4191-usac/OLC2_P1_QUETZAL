import {AST} from "../ast/AST"
import { Entorno } from "../ast/Entorno"
import { Instruccion } from "../interfaces/Instruccion" 
import { Traduccion } from "../ast/Traduccion";

export class Continue implements Instruccion {
    fila: number;
    columna: number;

    constructor(fila: number, columna: number) {
        this.fila = fila;
        this.columna = columna;
    }

    ejecutar(ent: Entorno, arbol: AST, errores: any, imprimir: any) {
        return this;
    }

    traducir(ent: Entorno, arbol: AST, trad: Traduccion) {
        throw new Error("Method not implemented.");
    }

}