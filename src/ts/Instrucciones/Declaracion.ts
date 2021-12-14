import {AST} from "../ast/AST"
import { Entorno } from "../ast/Entorno"
import { Instruccion } from "../interfaces/Instruccion" 
import { Errores } from '../ast/Error';
import { Simbolo } from "../ast/Simbolo";
import { Tipo } from "../AST/Tipo";
import { Llamada } from './Llamada';
import { Traduccion } from "../ast/Traduccion";
import { Return } from './Return';
import { Arreglo } from '../expresiones/Arreglo';
import { CopiaArreglo } from '../expresiones/CopiaArreglo';

export class Declaracion implements Instruccion {

    public tipo: Tipo;
    public identificador: string[];
    public valor: any;
    fila: number;
    columna: number;
    esArreglo: boolean;

    constructor(tipo: Tipo, identificador: string[], valor: any, fila: number, columna: number, esArreglo: boolean = false) {
        this.tipo = tipo;
        this.identificador = identificador;
        this.valor = valor;
        this.fila = fila;
        this.columna = columna;
        this.esArreglo = esArreglo;
    }

    ejecutar(ent: Entorno, arbol: AST, errores: any, imprimir: any) {
        this.identificador.forEach((id: string) => {
            if (!ent.existeEnActual(id)) {
                if (!this.esArreglo) { //No es arreglo
                    if (this.valor === null) {
                        const simbolo = new Simbolo(this.tipo, id, this.valorDefecto(), this.fila, this.columna);
                        ent.agregar(id, simbolo);
                    } else if (this.valor instanceof Llamada) {
                        if (this.tipo === this.valor.nombreFuncion.getTipo(ent, arbol, errores, imprimir)) {
                            const valor = this.valor.ejecutar(ent, arbol, errores, imprimir);
                            var simbolo;
                            if (valor instanceof Return) {
                                var val1 = valor.expresion;
                                simbolo = new Simbolo(this.tipo, id, val1, this.fila, this.columna);
                            } else {
                                simbolo = new Simbolo(this.tipo, id, valor, this.fila, this.columna);
                            }
                            ent.agregar(id, simbolo);
                        } else {
                            let er = new Errores("Semántico", "El valor no coincide con el tipo de la variable", this.fila, this.columna, "");
                            errores.push(er);
                            imprimir.push("\n>>Error semántico en linea " + this.fila + ", El valor no coincide con el tipo de la variable\n");
                            return er;
                        }
                    } else if (this.valor instanceof Arreglo) {
                        let er = new Errores("Semántico", "El valor no coincide con el tipo de la variable", this.fila, this.columna, "");
                        errores.push(er);
                        imprimir.push("\n>>Error semántico en linea " + this.fila + ", El valor no coincide con el tipo de la variable\n");
                        return er;
                    } else {
                        if (this.tipo === this.valor.getTipo(ent, arbol, errores, imprimir)) {
                            const valor = this.valor.getValorImplicito(ent, arbol, errores, imprimir);
                            const simbolo = new Simbolo(this.tipo, id, valor, this.fila, this.columna);
                            ent.agregar(id, simbolo);
                        } else {
                            let er = new Errores("Semántico", "El valor no coincide con el tipo de la variable", this.fila, this.columna, "");
                            errores.push(er);
                            imprimir.push("\n>>Error semántico en linea " + this.fila + ", El valor no coincide con el tipo de la variable\n");
                            return er;
                        }
                    }
                } else { //Si es Arreglo
                    if (this.valor === null) {
                        const simbolo = new Simbolo(this.tipo, id, [], this.fila, this.columna);
                        ent.agregar(id, simbolo);
                    } else if (this.valor instanceof Arreglo || this.valor instanceof CopiaArreglo) {
                        var val = this.valor.getValorImplicito(ent, arbol, errores, imprimir);
                        for (let i: number = 0; i < val.length; i++) {
                            var tip = this.obtenerTipo(val[i]);
                            if (this.tipo !== tip) {
                                let er = new Errores("Semántico", "El valor no coincide con el tipo de la variable", this.fila, this.columna, "");
                                errores.push(er);
                                imprimir.push("\n>>Error semántico en linea " + this.fila + ", El valor no coincide con el tipo de la variable\n");
                                return er;
                            }
                        }
                        const simbolo = new Simbolo(this.tipo, id, val, this.fila, this.columna);
                        ent.agregar(id, simbolo);
                    } else {
                        let er = new Errores("Semántico", "El valor no coincide con el tipo de la variable", this.fila, this.columna, "");
                        errores.push(er);
                        imprimir.push("\n>>Error semántico en linea " + this.fila + ", El valor no coincide con el tipo de la variable\n");
                        return er;
                    }
                }
            } else {
                let er = new Errores("Semántico", "El identificador " + id + " ya existe en el entorno actual", this.fila, this.columna, "");
                errores.push(er);
                imprimir.push("\n>>Error semántico en linea " + this.fila + ", El identificador " + id + " ya existe en el entorno actual\n");
                return er;
            }
        });
    }

    private valorDefecto() {
        if (this.tipo == Tipo.INT) {
            return 0;
        } else if (this.tipo == Tipo.DOUBLE) {
            return 0.0;
        } else if (this.tipo == Tipo.STRING) {
            return "";
        } else if (this.tipo == Tipo.CHAR) {
            return "''";
        } else if (this.tipo == Tipo.BOOLEAN) {
            return false;
        } else if (this.tipo == Tipo.ANY) {
            return undefined;
        } else if (this.esArreglo) {
            return [];
        } else {
            return null;
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