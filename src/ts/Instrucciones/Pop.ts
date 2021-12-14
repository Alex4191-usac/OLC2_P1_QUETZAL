import {AST} from "../ast/AST"
import { Entorno } from "../ast/Entorno"
import { Instruccion } from "../interfaces/Instruccion" 
import { Traduccion } from "../ast/Traduccion";
export class Pop implements Instruccion {
    fila: number;
    columna: number;
    id: any;

    constructor(id: any, fila: number, columna: number) {
        this.id = id;
        this.fila = fila;
        this.columna = columna;
    }

    ejecutar(ent: Entorno, arbol: AST, errores: any, imprimir: any) {
        let ide = this.id.getValorImplicito(ent, arbol, errores, imprimir);
        const simbolo = ent.getSimbolo(this.id.identificador);
        let aux = ide.pop();
        simbolo.valor = ide;
        ent.reemplazar(this.id.identificador, simbolo);
        return aux;
    }

    traducir(ent: Entorno, arbol: AST, trad: Traduccion) {
        throw new Error("Method not implemented.");
    }

}