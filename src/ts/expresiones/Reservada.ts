import {AST} from "../ast/AST"
import { Entorno } from "../ast/Entorno"
import {Tipo} from "../ast/Tipo"
import { Expresion } from "../interfaces/Expresion"
import { Traduccion } from "../ast/Traduccion"

export class Reservada implements Expresion {
    fila: number;
    columna: number;
    valor: any;
    palabra: string;

    constructor(palabra: string, valor: any, fila: number, columna: number) {
        this.palabra = palabra;
        this.fila = fila;
        this.columna = columna;
        this.valor = valor;

    }

    getTipo(ent: Entorno, arbol: AST, errores: any, imprimir: any): Tipo {
        throw new Error("Method not implemented.");
    }

    getValorImplicito(ent: Entorno, arbol: AST, errores: any, imprimir: any) {
        return this.palabra.toLowerCase();
    }

    traducir(ent: Entorno, arbol: AST, trad: Traduccion) {
        throw new Error("Method not implemented.");
    }

}