import {AST} from "../ast/AST"
import { Entorno } from "../ast/Entorno"
import { Instruccion } from "../interfaces/Instruccion" 
import { Expresion } from "../interfaces/Expresion"
import { Errores } from '../ast/Error';
import { Simbolo } from "../ast/Simbolo";
import { Parametro } from '../expresiones/Parametro';
import { Tipo } from "../AST/Tipo";
import { Traduccion } from "../ast/Traduccion";
import { Return } from './Return';


export class Funcion implements Instruccion {


    tipo: Tipo;
    nombreFuncion: string;
    listaParametros: Array<Instruccion>;
    listaInstrucciones: Array<Instruccion>;
    fila: number;
    columna: number;
    yapaso: boolean;

    constructor(tipo: Tipo, nombreFuncion: string, listaParametros: Array<Instruccion>, listaInstrucciones: Array<Instruccion>, fila: number, columna: number, yapaso: boolean = false) {
        this.tipo = tipo;
        this.nombreFuncion = nombreFuncion;
        this.listaParametros = listaParametros;
        this.listaInstrucciones = listaInstrucciones;
        this.fila = fila;
        this.columna = columna;
        this.yapaso = yapaso;
    }

    ejecutar(ent: Entorno, arbol: AST, errores: any, imprimir: any) {
        if (ent.existe(this.nombreFuncion)) {
            if (this.yapaso === true) {
                const entorno = new Entorno(ent, this.nombreFuncion);
                for (let i: number = 0; i < this.listaInstrucciones.length; i++) {
                    var resp = this.listaInstrucciones[i].ejecutar(entorno, arbol, errores, imprimir);
                    if (resp instanceof Errores) return resp;
                    if (resp instanceof Return) return resp;
                }
            } else {
                let err = new Errores("Semántico", "El nombre de la función ya está en uso.", this.fila, this.columna, ent.nombre);
                errores.push(err);
                imprimir.push("\n>>Error semántico en línea " + this.fila + ", El nombre de la función ya está en uso.");
                return err;
            }
        } else {
            var simbolo = new Simbolo(this.tipo, this.nombreFuncion, this, this.fila, this.columna);
            ent.agregar(this.nombreFuncion, simbolo);
            this.yapaso = true;
        }
    }
    traducir(ent: Entorno, arbol: AST, trad: Traduccion) {
        throw new Error("Method not implemented.");
    }
}