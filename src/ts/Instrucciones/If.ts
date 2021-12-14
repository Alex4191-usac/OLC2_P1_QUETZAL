import {AST} from "../ast/AST"
import { Entorno } from "../ast/Entorno"
import { Instruccion } from "../interfaces/Instruccion" 
import { Expresion } from "../interfaces/Expresion"
import { Errores } from '../ast/Error';
import { Simbolo } from "../ast/Simbolo";
import { Continue } from './Continue';
import { Break } from './Break';
import { Return } from './Return';
import { Traduccion } from "../ast/Traduccion";


export class If implements Instruccion {

    condicion: Expresion;
    listadoInstrucciones: Array<Instruccion>;
    fila: number;
    columna: number;
    listadoElse: Array<Instruccion>;

    constructor(condicion: Expresion, listadoInstrucciones: Array<Instruccion>, fila: number, columna: number, listadoElse: Array<Instruccion>) {
        this.condicion = condicion;
        this.listadoInstrucciones = listadoInstrucciones;
        this.fila = fila;
        this.columna = columna;
        this.listadoElse = listadoElse;
    }

    ejecutar(ent: Entorno, arbol: AST, errores: any, imprimir: any) {
        if (typeof (this.condicion.getValorImplicito(ent, arbol, errores, imprimir)) === "boolean") {
            if (this.condicion.getValorImplicito(ent, arbol, errores, imprimir)) {
                const entorno = new Entorno(ent, "If");
                if (this.listadoInstrucciones.length > 0) {
                    for (let i: number = 0; i < this.listadoInstrucciones.length; i++) {
                        var resp = this.listadoInstrucciones[i].ejecutar(entorno, arbol, errores, imprimir);
                        if (resp instanceof Continue || resp instanceof Break || resp instanceof Return || resp instanceof Errores) {
                            return resp;
                        }
                    }
                }
            } else {
                const entorno = new Entorno(ent, "Else");
                if (this.listadoElse.length > 0) {
                    for (let i: number = 0; i < this.listadoElse.length; i++) {
                        var resp = this.listadoElse[i].ejecutar(entorno, arbol, errores, imprimir);
                        if (resp instanceof Continue || resp instanceof Break || resp instanceof Return || resp instanceof Errores) {
                            return resp;
                        }
                    }
                }
            }
        } else {
            let er = new Errores("Semántico", "No se puede verificar la condición, los tipos no coinciden", this.fila, this.columna, "");
            errores.push(er);
            imprimir.push(">>Error semántico en linea " + this.fila + ", No se puede verificar la condición, los tipos no coinciden\n");
            return er;
        }
    }

    traducir(ent: Entorno, arbol: AST, trad: Traduccion) {
        throw new Error("Method not implemented.");
    }
}