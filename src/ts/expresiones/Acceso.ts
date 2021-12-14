import {AST} from "../ast/AST"
import { Entorno } from "../ast/Entorno"
import { Simbolo } from "../ast/Simbolo"
import {Tipo} from "../ast/Tipo"
import { Expresion } from "../interfaces/Expresion"
import { Errores } from '../ast/Error';
import { Traduccion } from "../ast/Traduccion"

export class Acceso implements Expresion {
    fila: number;
    columna: number;
    public identificador: string;
    public esArreglo: boolean;
    inicio: any;
    fin: any;

    constructor(identificador: string, fila: number, columna: number, esArreglo: boolean = false, inicio: any = null, fin: any = null) {
        this.identificador = identificador;
        this.fila = fila;
        this.columna = columna;
        this.esArreglo = esArreglo;
        this.inicio = inicio;
        this.fin = fin
    }

    getTipo(ent: Entorno, arbol: AST, errores: any, imprimir: any): Tipo {
        if (ent.existe(this.identificador)) {
            const simbolo: Simbolo = ent.getSimbolo(this.identificador);
            return simbolo.getTipo(ent, arbol, errores, imprimir);
        }
        return Tipo.NULL;
    }

    getValorImplicito(ent: Entorno, arbol: AST, errores: any, imprimir: any) {
        if (ent.existe(this.identificador)) {
            const simbolo: Simbolo = ent.getSimbolo(this.identificador);
            if (!this.esArreglo) { //Si no es arreglo o se quiere el arreglo completo
                return simbolo.valor;
            } else { //Cuando se quiere una posición específica de un arreglo
                var completo = simbolo.valor;
                if (this.fin === null) { //Si solo viene -> arreglo[indice]
                    let posi = this.inicio.getValorImplicito(ent, arbol, errores, imprimir);
                    if (posi === "begin") {
                        return completo[0];
                    } else if (posi === "end") {
                        return completo[simbolo.valor.length - 1];
                    } else {
                        if (typeof (posi) === "number") {
                            if (this.esEntero(posi)) {
                                if (posi >= 0 && posi <= (simbolo.valor.length - 1)) {
                                    return completo[posi];
                                } else {
                                    let er = new Errores("Semántico", "El índice está fuera de los límites de arreglo", this.fila, this.columna, ent.nombre);
                                    errores.push(er);
                                    imprimir.push("\n>>Error semántico en linea " + this.fila + ", El índice está fuera de los límites de arreglo\n");
                                    return er;
                                }
                            } else {
                                let er = new Errores("Semántico", "Acceso a la posición inválido", this.fila, this.columna, ent.nombre);
                                errores.push(er);
                                imprimir.push("\n>>Error semántico en linea " + this.fila + ", Acceso a la posición inválido\n");
                                return er;
                            }
                        } else {
                            let er = new Errores("Semántico", "Acceso a la posición inválido", this.fila, this.columna, ent.nombre);
                            errores.push(er);
                            imprimir.push("\n>>Error semántico en linea " + this.fila + ", Acceso a la posición inválido\n");
                            return er;
                        }
                    }
                } else { //Si viene -> arreglo[indice:indice]
                    var pi = this.inicio.getValorImplicito(ent, arbol, errores, imprimir);
                    var pf = this.fin.getValorImplicito(ent, arbol, errores, imprimir);
                    let posi = pi === "begin" ? 0 : pi;
                    let posf = pf === "end" ? simbolo.valor.length - 1 : pf;
                    if (typeof (posi) === "number" && typeof (posf) === "number") {
                        if (this.esEntero(posi) && this.esEntero(posf)) {
                            if ((posi >= 0 && posi <= completo.length - 1) && (posf >= 0 && posf <= completo.length - 1) && (posi < posf)) {
                                let aux = [];
                                for (posi; posi <= posf; posi++) {
                                    aux.push(completo[posi]);
                                }
                                return aux;
                            } else {
                                let er = new Errores("Semántico", "Los índices están fuera de los límites de arreglo", this.fila, this.columna, ent.nombre);
                                errores.push(er);
                                imprimir.push("\n>>Error semántico en linea " + this.fila + ", Los índices están fuera de los límites de arreglo\n");
                                return er;
                            }
                        } else {
                            let er = new Errores("Semántico", "Acceso a la posición inválido", this.fila, this.columna, ent.nombre);
                            errores.push(er);
                            imprimir.push("\n>>Error semántico en linea " + this.fila + ", Acceso a la posición inválido\n");
                            return er;
                        }
                    } else {
                        let er = new Errores("Semántico", "Acceso a la posición inválido", this.fila, this.columna, ent.nombre);
                        errores.push(er);
                        imprimir.push("\n>>Error semántico en linea " + this.fila + ", Acceso a la posición inválido\n");
                        return er;
                    }
                }
            }
        } else {
            let er = new Errores("Semántico", "No existe la variable " + this.identificador + " en el entorno actual", this.fila, this.columna, ent.nombre);
            errores.push(er);
            imprimir.push("\n>>Error semántico en linea " + this.fila + ", No existe la variable " + this.identificador + " en el entorno actual\n");
            return er;
        }
    }

    esEntero(n: number) {
        return Number(n) === n && n % 1 === 0;
    }

    traducir(ent: Entorno, arbol: AST, trad: Traduccion) {
        throw new Error("Method not implemented.");
    }

}