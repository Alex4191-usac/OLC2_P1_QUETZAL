import {AST} from "../ast/AST"
import { Entorno } from "../ast/Entorno"
import { Instruccion } from "../interfaces/Instruccion" 
import { Expresion } from "../interfaces/Expresion"
import { Errores } from '../ast/Error';
import { Simbolo } from "../ast/Simbolo";
import { Continue } from './Continue';
import { Break } from './Break';
import { Return } from './Return';


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
                    this.listadoInstrucciones.forEach(inst => {
                        var resp = inst.ejecutar(entorno, arbol, errores, imprimir);
                        if (resp instanceof Continue || resp instanceof Break || resp instanceof Return) {
                            return resp;
                        }
                    });
                }
            } else {
                const entorno = new Entorno(ent, "Else");
                if (this.listadoElse.length > 0) {
                    this.listadoElse.forEach(inst => {
                        var resp = inst.ejecutar(entorno, arbol, errores, imprimir);
                        if (resp instanceof Continue || resp instanceof Break || resp instanceof Return) {
                            return resp;
                        }
                    });
                }
            }
        } else {
            errores.push(new Errores("Semántico", "No se puede verificar la condición, los tipos no coinciden", this.fila, this.columna, ""));
            imprimir.push(">>Error semántico en linea " + this.fila + ", No se puede verificar la condición, los tipos no coinciden\n");
        }
    }

    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }
}