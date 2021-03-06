import {AST} from "../ast/AST"
import { Entorno } from "../ast/Entorno"
import { Instruccion } from "../interfaces/Instruccion" 
import { Expresion } from "../interfaces/Expresion"
import { Errores } from '../ast/Error';
import { Continue } from './Continue';
import { Break } from './Break';
import { Return } from './Return';
import { Case } from './Case';
import { Tipo } from "../AST/Tipo";
import { Reservada } from '../expresiones/Reservada';
import { Traduccion } from "../ast/Traduccion";

export class Switch implements Instruccion {
    expresion: Expresion;
    listadoCases: Array<Case>;
    fila: number;
    columna: number;

    constructor(expresion: Expresion, listadoCases: Array<Case>, fila: number, columna: number) {
        this.expresion = expresion;
        this.listadoCases = listadoCases;
        this.fila = fila;
        this.columna = columna;
    }

    ejecutar(ent: Entorno, arbol: AST, errores: any, imprimir: any) {
        const val = this.expresion.getValorImplicito(ent, arbol, errores, imprimir);
        let vienedefaul = true;
        if (val !== null) {
            const tipo = this.expresion.getTipo(ent, arbol, errores, imprimir);
            if (tipo == Tipo.INT || tipo == Tipo.DOUBLE || tipo == Tipo.STRING || tipo == Tipo.CHAR) {
                for (let i: number = 0; i < this.listadoCases.length; i++) {
                    const valorc = this.listadoCases[i].expresion.getValorImplicito(ent, arbol, errores, imprimir);
                    if (val === valorc) {
                        const entorno = new Entorno(ent, "Switch");
                        var resp: any = this.listadoCases[i].ejecutar(entorno, arbol, errores, imprimir);
                        vienedefaul = false;
                        if (resp instanceof Break || resp instanceof Continue || resp instanceof Return || resp instanceof Errores) {
                            return resp;
                        }
                    }
                }
                if (vienedefaul) {
                    if (this.listadoCases[this.listadoCases.length - 1].expresion instanceof Reservada) {
                        const entorno = new Entorno(ent, "Switch");
                        var resp: any = this.listadoCases[this.listadoCases.length - 1].ejecutar(entorno, arbol, errores, imprimir);
                        if (resp instanceof Break || resp instanceof Continue || resp instanceof Return || resp instanceof Errores) {
                            return resp;
                        }
                    }
                }
            } else {
                let er = new Errores("Sem??ntico", "Tipo de dato inv??lido para realizar switch", this.fila, this.columna, "");
                errores.push(er);
                imprimir.push("\n>>Error sem??ntico en linea " + this.fila + ", El tipo de dato no es permitido para esta funci??n\n");
                return er;
            }
        } else {
            let er = new Errores("Sem??ntico", "Se quiere hacer switch de una variable que no existe en este entorno", this.fila, this.columna, "");
            errores.push(er);
            imprimir.push("\n>>Error sem??ntico en linea " + this.fila + ", Se quiere hacer switch de una variable que no existe en este entorno\n");
            return er;
        }
    }
    traducir(ent: Entorno, arbol: AST, trad: Traduccion) {
        throw new Error("Method not implemented.");
    }

}