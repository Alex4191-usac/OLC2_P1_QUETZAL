import {AST} from "../ast/AST"
import { Entorno } from "../ast/Entorno"
import { Instruccion } from "../interfaces/Instruccion" 
import { Errores } from '../ast/Error';
import { Simbolo } from "../ast/Simbolo";
import { Tipo } from "../AST/Tipo";
import { Traduccion } from "../ast/Traduccion";
import { Arreglo } from '../expresiones/Arreglo';
import { Return } from './Return';
import { Llamada } from './Llamada';


export class Asignacion implements Instruccion {

    public identificador: string;
    public valor: any;
    fila: number;
    columna: number;
    indice: any;

    constructor(identificador: string, valor: any, fila: number, columna: number, indice: any = null) {
        this.identificador = identificador;
        this.valor = valor;
        this.fila = fila;
        this.columna = columna;
        this.indice = indice;
    }

    ejecutar(ent: Entorno, arbol: AST, errores: any, imprimir: any) {
        if (ent.existe(this.identificador)) {
            const simbolo: Simbolo = ent.getSimbolo(this.identificador);
            if (!(this.valor instanceof Arreglo)) {
                if (this.indice === null) {
                    if (this.valor instanceof Llamada) {
                        if (simbolo.getTipo(ent, arbol, errores, imprimir) === this.valor.nombreFuncion.getTipo(ent, arbol, errores, imprimir)) {
                            const valora = this.valor.ejecutar(ent, arbol, errores, imprimir);
                            if (valora instanceof Return) {
                                var val1 = valora.expresion;
                                simbolo.valor = val1;
                            } else {
                                simbolo.valor = valora
                            }
                            ent.reemplazar(this.identificador, simbolo);
                        } else {
                            let er = new Errores("Semántico", "El valor no coincide con el tipo de la variable", this.fila, this.columna, "");
                            errores.push(er);
                            imprimir.push("\n>>Error semántico en linea " + this.fila + ", El valor no coincide con el tipo de la variable\n");
                            return er;
                        }
                    } else if (simbolo.getTipo(ent, arbol, errores, imprimir) === this.valor.getTipo(ent, arbol, errores, imprimir)) {
                        const valor = this.valor.getValorImplicito(ent, arbol, errores, imprimir);
                        if (valor instanceof Return) {
                            var val1 = valor.expresion;
                            simbolo.valor = val1;
                        } else {
                            simbolo.valor = valor;
                        }
                        ent.reemplazar(this.identificador, simbolo)
                    } else {
                        let er = new Errores("Semántico", "El valor no coincide con el tipo de la variable " + this.identificador, this.fila, this.columna, "");
                        errores.push(er);
                        imprimir.push("\n>>Error semántico en linea " + this.fila + ", El valor no coincide con el tipo de la variable " + this.identificador + "\n");
                        return er;
                    }
                } else { // Asignar un valor a la posicion de un arreglo
                    let posi = this.indice.getValorImplicito(ent, arbol, errores, imprimir);
                    if (typeof (posi) === "number") {
                        if (this.esEntero(posi)) {
                            let val = this.valor.getValorImplicito(ent, arbol, errores, imprimir);
                            simbolo.valor[posi] = val;
                            ent.reemplazar(this.identificador, simbolo);
                        } else {
                            let er = new Errores("Semántico", "El índice no es válido", this.fila, this.columna, "");
                            errores.push(er);
                            imprimir.push("\n>>Error semántico en linea " + this.fila + ", El índice no es válido\n");
                            return er;
                        }
                    } else {
                        let er = new Errores("Semántico", "El índice no es válido", this.fila, this.columna, "");
                        errores.push(er);
                        imprimir.push("\n>>Error semántico en linea " + this.fila + ", El índice no es válido\n");
                        return er;
                    }
                }
            } else {
                var val = this.valor.getValorImplicito(ent, arbol, errores, imprimir);
                for (let i: number = 0; i < val.length; i++) {
                    var tipo = this.obtenerTipo(val[i]);
                    if (simbolo.getTipo(ent, arbol, errores, imprimir) !== tipo) {
                        let er = new Errores("Semántico", "El valor no coincide con el tipo de la variable " + this.identificador, this.fila, this.columna, "");
                        errores.push(er);
                        imprimir.push("\n>>Error semántico en linea " + this.fila + ", El valor no coincide con el tipo de la variable " + this.identificador + "\n");
                        return er;
                    }
                }
                simbolo.valor = val;
                ent.reemplazar(this.identificador, simbolo);
            }
        } else {
            let er = new Errores("Semántico", "No existe la variable " + this.identificador + " en el entorno actual", this.fila, this.columna, "");
            errores.push(er);
            imprimir.push("\n>>Error semántico en linea " + this.fila + ", No existe la variable " + this.identificador + " en el entorno actual\n");
            return er;
        }
    }

    obtenerTipo(val: any) {
        if (typeof (val) === "number") {
            if (this.esEntero(val)) {
                return Tipo.INT
            }
            return Tipo.DOUBLE
        } else if (typeof (val) === "string") {
            if (this.esChar(val)) {
                return Tipo.CHAR
            }
            return Tipo.STRING
        } else if (typeof (val) === "boolean") {
            return Tipo.BOOLEAN
        } else if (typeof (val) === "object") {
            val.forEach((element: any) => {
                return this.obtenerTipo(element);
            });
        }
        return Tipo.VOID
    }

    esEntero(n: number) {
        return Number(n) === n && n % 1 === 0;
    }

    esChar(n: string) {
        return n[0] === "'" && n[2] === "'" && n.length === 3;
    }

    traducir(ent: Entorno, arbol: AST, trad: Traduccion) {
        throw new Error("Method not implemented.");
    }
}