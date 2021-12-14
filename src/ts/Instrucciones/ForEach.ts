import {AST} from "../ast/AST"
import { Entorno } from "../ast/Entorno"
import { Instruccion } from "../interfaces/Instruccion" 
import { Expresion } from "../interfaces/Expresion"
import { Errores } from '../ast/Error';
import { Simbolo } from "../ast/Simbolo";
import { Tipo } from "../AST/Tipo";
import { Traduccion } from "../ast/Traduccion";



export class ForEach implements Instruccion {
    id: string;
    expresion: Expresion;
    listaInstrucciones: any[];
    fila: number;
    columna: number;

    // for letra in cadena 
    constructor(id: string, expresion: Expresion, listaInstrucciones: any[], fila: number, columna: number) {
        this.id = id;
        this.expresion = expresion;
        this.listaInstrucciones = listaInstrucciones;
        this.fila = fila;
        this.columna = columna;
    }

    ejecutar(ent: Entorno, arbol: AST, errores: any, imprimir: any) {
        let cadena = this.expresion.getValorImplicito(ent, arbol, errores, imprimir);
        let variable = new Simbolo(Tipo.NULL, this.id, null, this.fila, this.columna);
        let entorno = new Entorno(ent, "For Each");
        entorno.agregar(this.id, variable);
        let aux = [];
        if (typeof (cadena) === "string") {
            aux = cadena.split("");
            for (let i: number = 0; i < aux.length; i++) {
                variable.valor = aux[i];
                entorno.reemplazar(this.id, variable);
                for (let j: number = 0; j < this.listaInstrucciones.length; j++) {
                    this.listaInstrucciones[j].ejecutar(entorno, arbol, errores, imprimir);
                }
            }
        } else if (typeof (cadena) === "object") {
            for (let i: number = 0; i < cadena.length; i++) {
                variable.valor = cadena[i];
                entorno.reemplazar(this.id, variable);
                for (let j: number = 0; j < this.listaInstrucciones.length; j++) {
                    this.listaInstrucciones[j].ejecutar(entorno, arbol, errores, imprimir);
                }
            }
        } else {
            let er = new Errores("Semántico", "No es posible realizar la operación", this.fila, this.columna, "");
            errores.push(er);
            imprimir.push("\n>>Error semántico en linea " + this.fila + ", No es posible realizar la operación\n");
            return er;
        }
    }
    traducir(ent: Entorno, arbol: AST, trad: Traduccion) {
        throw new Error('Method not implemented.');
    }
}

