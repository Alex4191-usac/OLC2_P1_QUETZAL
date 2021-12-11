import {AST} from "../ast/AST"
import { Entorno } from "../ast/Entorno"
import { Instruccion } from "../interfaces/Instruccion" 
import { Expresion } from "../interfaces/Expresion"
import { Errores } from '../ast/Error';
import { Simbolo } from "../ast/Simbolo";



export class Asignacion implements Instruccion {

    public identificador: string;
    public valor: Expresion;
    fila: number;
    columna: number;

    constructor(identificador: string, valor: Expresion, fila: number, columna: number) {
        this.identificador = identificador;
        this.valor = valor;
        this.fila = fila;
        this.columna = columna;

    }

    ejecutar(ent: Entorno, arbol: AST, errores: any, imprimir: any) {
        if (ent.existe(this.identificador)) {
            const simbolo: Simbolo = ent.getSimbolo(this.identificador);
            if (simbolo.getTipo(ent, arbol, errores, imprimir) === this.valor.getTipo(ent, arbol, errores, imprimir)) {
                const valor = this.valor.getValorImplicito(ent, arbol, errores, imprimir);
                simbolo.valor = valor;
                ent.reemplazar(this.identificador, simbolo)
            } else {
                errores.push(new Errores("Semántico", "El valor no coincide con el tipo de la variable " + this.identificador, this.fila, this.columna, ""));
                imprimir.push("\n>>Error semántico en linea " + this.fila + ", El valor no coincide con el tipo de la variable " + this.identificador + "\n");
            }
        } else {
            errores.push(new Errores("Semántico", "No existe la variable " + this.identificador + " en el entorno actual", this.fila, this.columna, ""));
            imprimir.push("\n>>Error semántico en linea " + this.fila + ", No existe la variable " + this.identificador + " en el entorno actual\n");
        }
    }

    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }
}