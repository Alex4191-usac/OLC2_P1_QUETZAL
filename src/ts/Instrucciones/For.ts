import {AST} from "../ast/AST"
import { Entorno } from "../ast/Entorno"
import { Instruccion } from "../interfaces/Instruccion" 
import { Expresion } from "../interfaces/Expresion"
import { Errores } from "../ast/Error"
import { Continue } from './Continue';
import { Break } from './Break';
import { Return } from './Return';
import { Declaracion } from './Declaracion';
import { Asignacion } from './Asignacion';
import { Traduccion } from "../ast/Traduccion"


export class For implements Instruccion {
    declaracion: any;
    condicion: Expresion;
    incDec: Instruccion;
    listaInstrucciones: Array<Instruccion>;
    fila: number;
    columna: number;

    constructor(declaracion: any, condicion: Expresion, incDec: Instruccion, listaInstrucciones: Array<Instruccion>, fila: number, columna: number) {
        this.declaracion = declaracion;
        this.condicion = condicion;
        this.incDec = incDec;
        this.listaInstrucciones = listaInstrucciones;
        this.fila = fila;
        this.columna = columna;
    }

    ejecutar(ent: Entorno, arbol: AST, errores: any, imprimir: any) {
        const entorno = new Entorno(ent, "For");
        if (this.declaracion instanceof Declaracion || this.declaracion instanceof Asignacion) {
            this.declaracion.ejecutar(entorno, arbol, errores, imprimir);
        }
        while (true) {
            var condi = this.condicion.getValorImplicito(entorno, arbol, errores, imprimir);
            if (condi) {
                for (let i: number = 0; i < this.listaInstrucciones.length; i++) {
                    var rep = this.listaInstrucciones[i].ejecutar(entorno, arbol, errores, imprimir);
                    if (rep instanceof Break) return null;
                    if (rep instanceof Continue) break;
                    if (rep instanceof Return) return rep;
                    if (rep instanceof Errores) return rep;
                }
                this.incDec.ejecutar(entorno, arbol, errores, imprimir);
            } else {
                break;
            }
        }
    }
    traducir(ent: Entorno, arbol: AST, trad: Traduccion) {
        throw new Error('Method not implemented.');
    }
}


