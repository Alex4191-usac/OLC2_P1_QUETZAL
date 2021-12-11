import {AST} from "../ast/AST"
import { Entorno } from "../ast/Entorno"
import { Instruccion } from "../interfaces/Instruccion" 
import { Expresion } from "../interfaces/Expresion"
import { Errores } from '../ast/Error';
import { Simbolo } from "../ast/Simbolo";
import { Acceso } from '../expresiones/Acceso';
import { Aritmetica } from '../expresiones/Aritmetica';

export class Incremento implements Instruccion {
    fila: number;
    columna: number;
    valor: Expresion;
    identificador: string;

    constructor(expresion: Expresion, fila: number, columna: number) {
        this.identificador = "";
        this.valor = expresion;
        this.fila = fila;
        this.columna = columna;
    }

    ejecutar(ent: Entorno, arbol: AST, errores: any, imprimir: any) {
        if (this.valor instanceof Aritmetica) {
            if (this.valor.op1 instanceof Acceso) {
                this.identificador = this.valor.op1.identificador;
                if (ent.existe(this.identificador)) {
                    const simbolo: Simbolo = ent.getSimbolo(this.identificador);
                    if (simbolo.getTipo(ent, arbol, errores, imprimir) === this.valor.getTipo(ent, arbol, errores, imprimir)) {
                        const val = this.valor.getValorImplicito(ent, arbol, errores, imprimir);
                        simbolo.valor = val;
                        ent.reemplazar(this.identificador, simbolo);
                    } else {
                        errores.push(new Errores("Semántico", "El valor no coincide con el tipo de la variable " + this.identificador, this.fila, this.columna, ""));
                        imprimir.push("\n>>Error semántico en linea " + this.fila + ", El valor no coincide con el tipo de la variable " + this.identificador + "\n");
                    }
                } else {
                    errores.push(new Errores("Semántico", "No existe la variable " + this.identificador + " en el entorno actual", this.fila, this.columna, ""));
                    imprimir.push("\n>>Error semántico en linea " + this.fila + ", No existe la variable " + this.identificador + " en el entorno actual\n");
                }
            }
        }
        return this.valor;
    }

    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }

}