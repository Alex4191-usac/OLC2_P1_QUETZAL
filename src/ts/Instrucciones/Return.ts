import {AST} from "../ast/AST"
import { Entorno } from "../ast/Entorno"
import { Instruccion } from "../interfaces/Instruccion" 
import { Expresion } from "../interfaces/Expresion"
import { Errores } from '../ast/Error';
import { Simbolo } from "../ast/Simbolo";
import { Llamada } from "./Llamada";
import { Traduccion } from "../ast/Traduccion";
export class Return implements Instruccion {
    fila: number;
    columna: number;
    expresion: any;

    constructor(expresion: any, fila: number, columna: number) {
        this.expresion = expresion;
        this.fila = fila;
        this.columna = columna;
    }

    ejecutar(ent: Entorno, arbol: AST, errores: any, imprimir: any) {
        if (this.expresion !== null) {
            if (this.expresion instanceof Llamada) {
                const valor = this.expresion.ejecutar(ent, arbol, errores, imprimir);
                return new Return(valor, this.fila, this.columna);
            } else {
                const valor = this.expresion.getValorImplicito(ent, arbol, errores, imprimir);
                return new Return(valor, this.fila, this.columna);
            }
        } else {
            return this;
        }
    }
    
    traducir(ent: Entorno, arbol: AST, trad: Traduccion) {
        throw new Error("Method not implemented.");
    }

}