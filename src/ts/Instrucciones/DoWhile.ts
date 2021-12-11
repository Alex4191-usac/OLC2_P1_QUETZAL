import {AST} from "../ast/AST"
import { Entorno } from "../ast/Entorno"
import { Instruccion } from "../interfaces/Instruccion" 
import { Expresion } from "../interfaces/Expresion"
import { Errores } from '../ast/Error';
import { Simbolo } from "../ast/Simbolo";
import { Continue } from './Continue';
import { Break } from './Break';
import { Return } from './Return';

export class DoWhile implements Instruccion {

    condicion: Expresion;
    listadoInstrucciones: Array<Instruccion>;
    fila: number;
    columna: number;

    constructor(condicion: Expresion, listadoInstrucciones: Array<Instruccion>, fila: number, columna: number) {
        this.condicion = condicion;
        this.listadoInstrucciones = listadoInstrucciones;
        this.fila = fila;
        this.columna = columna;
    }

    ejecutar(ent: Entorno, arbol: AST, errores: any, imprimir: any) {
        while (true) {
            const entorno = new Entorno(ent, "Do-While");
            for (let i: number = 0; i < this.listadoInstrucciones.length; i++) {
                var resp = this.listadoInstrucciones[i].ejecutar(entorno, arbol, errores, imprimir);
                if (resp instanceof Break) return;
                if (resp instanceof Continue) break;
                if (resp instanceof Return) return resp;
            }
            var condi = this.condicion.getValorImplicito(entorno, arbol, errores, imprimir);
            if (!condi) {
                break;
            }
        }
    }
    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }
}