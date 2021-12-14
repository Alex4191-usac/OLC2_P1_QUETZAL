import {AST} from "../ast/AST"
import { Entorno } from "../ast/Entorno"
import { Instruccion } from "../interfaces/Instruccion" 
import { Expresion } from "../interfaces/Expresion"
import { Traduccion } from "../ast/Traduccion"
import { Continue } from './Continue';
import { Break } from './Break';
import { Return } from './Return';
import { Errores } from "../ast/Error"


export class Case implements Instruccion {

    expresion: Expresion;
    listaInstrucciones: Array<Instruccion>;
    fila: number;
    columna: number;

    constructor(expresion: Expresion, listaInstrucciones: Array<Instruccion>, fila: number, columna: number) {
        this.expresion = expresion;
        this.listaInstrucciones = listaInstrucciones;
        this.fila = fila;
        this.columna = columna;
    }

    ejecutar(ent: Entorno, arbol: AST, errores: any, imprimir: any) {
        if (this.listaInstrucciones.length > 0) {
            for (let i: number = 0; i < this.listaInstrucciones.length; i++) {
                var resp = this.listaInstrucciones[i].ejecutar(ent, arbol, errores, imprimir);
                if (resp instanceof Continue || resp instanceof Break || resp instanceof Return || resp instanceof Errores) {
                    return resp;
                }
            }
        }
    }
    traducir(ent: Entorno, arbol: AST, trad: Traduccion) {
        throw new Error("Method not implemented.");
    }
}