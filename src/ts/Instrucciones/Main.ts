import {AST} from "../ast/AST"
import { Entorno } from "../ast/Entorno"
import { Instruccion } from "../interfaces/Instruccion" 
import { Traduccion } from "../ast/Traduccion";

export class Main implements Instruccion {

    listaInstrucciones: Array<Instruccion>;
    fila: number;
    columna: number;

    constructor(listaInstrucciones: Array<Instruccion>, fila: number, columna: number) {
        this.listaInstrucciones = listaInstrucciones;
        this.fila = fila;
        this.columna = columna;
    }

    ejecutar(ent: Entorno, arbol: AST, errores: any, imprimir: any) {
        if (this.listaInstrucciones.length > 0) {
            const entorno = new Entorno(ent, "main");
            this.listaInstrucciones.forEach(inst => {
                inst.ejecutar(entorno, arbol, errores, imprimir);
            });
        }
    }
    
    traducir(ent: Entorno, arbol: AST, trad: Traduccion) {
        throw new Error("Method not implemented.");
    }
}