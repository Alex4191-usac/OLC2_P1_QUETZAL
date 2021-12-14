import {AST} from "../ast/AST"
import { Entorno } from "../ast/Entorno"
import {Tipo} from "../ast/Tipo"
import { Expresion } from "../interfaces/Expresion"
import { Traduccion } from "../ast/Traduccion"
import { Acceso } from './Acceso';
import { Arreglo } from './Arreglo';
import { Errores } from "../ast/Error"

export enum FuncionT {
    SENO,
    COSENO,
    TANGENTE,
    RAIZ,
    LOG10
}

export class Trigonometrica implements Expresion {
    fila: number;
    columna: number;
    op1: Expresion;
    funcion: FuncionT;
    esArreglo: boolean;

    constructor(op1: Expresion, funcion: FuncionT, esArreglo: boolean, fila: number, columna: number) {
        this.op1 = op1;
        this.funcion = funcion;
        this.esArreglo = esArreglo;
        this.fila = fila;
        this.columna = columna;
    }

    getTipo(ent: Entorno, arbol: AST, errores: any, imprimir: any): Tipo {
        const valor = this.getValorImplicito(ent, arbol, errores, imprimir);

        if (typeof (valor) === 'number' || typeof (valor) === "bigint") {
            if (this.esEntero(Number(valor))) {
                return Tipo.INT;
            }
            return Tipo.DOUBLE;
        } else if (typeof (valor) === 'string') {
            if (this.esChar(valor)) {
                return Tipo.CHAR;
            }
            return Tipo.STRING;
        } else if (typeof (valor) === 'boolean') {
            return Tipo.BOOLEAN;
        } else if (valor === null) {
            return Tipo.NULL;
        }
        return Tipo.VOID;
    }

    getValorImplicito(ent: Entorno, arbol: AST, errores: any, imprimir: any) {
        const valor = this.op1.getValorImplicito(ent, arbol, errores, imprimir);
        if (this.funcion == FuncionT.SENO) {
            if (!this.esArreglo) { //Si no es arreglo
                if (typeof (valor) === "number") {
                    return Math.sin(valor);
                } else {
                    let er = new Errores("Semántico", "No es posible efectuar la operación, tipo de dato inválido", this.fila, this.columna, ent.nombre);
                    errores.push(er);
                    imprimir.push("\>>Error semántico en linea " + this.fila + ", No es posible efectuar la operación, tipo de dato inválido\n");
                    return null;
                }
            } else { //Si sí es arreglo
                if (this.op1 instanceof Acceso) {
                    const simbolo = ent.getSimbolo(this.op1.identificador);
                    if (typeof (simbolo.valor) === "object") {
                        var aux: any = [];
                        for (let i: number = 0; i < simbolo.valor.length; i++) {
                            if (typeof (simbolo.valor[i]) === "number") {
                                aux.push(Math.sin(simbolo.valor[i]));
                            } else {
                                let er = new Errores("Semántico", "No es posible efectuar la operación, tipo de dato invalido", this.fila, this.columna, ent.nombre);
                                errores.push(er);
                                imprimir.push("\>>Error semántico en linea " + this.fila + ", No es posible efectuar la operación, tipo de dato invalido\n");
                                return null;
                            }
                        }
                        return aux;
                    } else {
                        let er = new Errores("Semántico", "No es posible efectuar la operación, no es un arreglo", this.fila, this.columna, ent.nombre);
                        errores.push(er);
                        imprimir.push("\>>Error semántico en linea " + this.fila + ", No es posible efectuar la operación, no es un arreglo\n");
                        return null;
                    }
                } else if (this.op1 instanceof Arreglo) {
                    var aux: any = [];
                    var e = this.op1.getValorImplicito(ent, arbol, errores, imprimir);
                    for (let i: number = 0; i < e.length; i++) {
                        if (typeof (e[i]) === "number") {
                            aux.push(Math.sin(e[i]));
                        } else {
                            let er = new Errores("Semántico", "No es posible efectuar la operación, tipo de dato invalido", this.fila, this.columna, ent.nombre);
                            errores.push(er);
                            imprimir.push("\>>Error semántico en linea " + this.fila + ", No es posible efectuar la operación, tipo de dato invalido\n");
                            return null;
                        }
                    }
                    return aux;
                } else {
                    let er = new Errores("Semántico", "No es posible efectuar la operación, no es un arreglo", this.fila, this.columna, ent.nombre);
                    errores.push(er);
                    imprimir.push("\>>Error semántico en linea " + this.fila + ", No es posible efectuar la operación, no es un arreglo\n");
                    return null;
                }
            }
        } else if (this.funcion == FuncionT.COSENO) {
            if (!this.esArreglo) {
                if (typeof (valor) === "number") {
                    return Math.cos(valor);
                } else {
                    let er = new Errores("Semántico", "No es posible efectuar la operación, tipo de dato inválido", this.fila, this.columna, ent.nombre);
                    errores.push(er);
                    imprimir.push("\>>Error semántico en linea " + this.fila + ", No es posible efectuar la operación, tipo de dato inválido\n");
                    return null;
                }
            } else {
                if (this.op1 instanceof Acceso) {
                    const simbolo = ent.getSimbolo(this.op1.identificador);
                    if (typeof (simbolo.valor) === "object") {
                        var aux: any = [];
                        for (let i: number = 0; i < simbolo.valor.length; i++) {
                            if (typeof (simbolo.valor[i]) === "number") {
                                aux.push(Math.cos(simbolo.valor[i]));
                            } else {
                                let er = new Errores("Semántico", "No es posible efectuar la operación, tipo de dato invalido", this.fila, this.columna, ent.nombre);
                                errores.push(er);
                                imprimir.push("\>>Error semántico en linea " + this.fila + ", No es posible efectuar la operación, tipo de dato invalido\n");
                                return null;
                            }
                        }
                        return aux;
                    } else {
                        let er = new Errores("Semántico", "No es posible efectuar la operación, no es un arreglo", this.fila, this.columna, ent.nombre);
                        errores.push(er);
                        imprimir.push("\>>Error semántico en linea " + this.fila + ", No es posible efectuar la operación, no es un arreglo\n");
                        return null;
                    }
                } else if (this.op1 instanceof Arreglo) {
                    var aux: any = [];
                    var e = this.op1.getValorImplicito(ent, arbol, errores, imprimir);
                    for (let i: number = 0; i < e.length; i++) {
                        if (typeof (e[i]) === "number") {
                            aux.push(Math.cos(e[i]));
                        } else {
                            let er = new Errores("Semántico", "No es posible efectuar la operación, tipo de dato invalido", this.fila, this.columna, ent.nombre);
                            errores.push(er);
                            imprimir.push("\>>Error semántico en linea " + this.fila + ", No es posible efectuar la operación, tipo de dato invalido\n");
                            return null;
                        }
                    }
                    return aux;
                } else {
                    let er = new Errores("Semántico", "No es posible efectuar la operación, no es un arreglo", this.fila, this.columna, ent.nombre);
                    errores.push(er);
                    imprimir.push("\>>Error semántico en linea " + this.fila + ", No es posible efectuar la operación, no es un arreglo\n");
                    return null;
                }
            }
        } else if (this.funcion == FuncionT.TANGENTE) {
            if (!this.esArreglo) {
                if (typeof (valor) === "number") {
                    return Math.tan(valor);
                } else {
                    let er = new Errores("Semántico", "No es posible efectuar la operación, tipo de dato inválido", this.fila, this.columna, ent.nombre);
                    errores.push(er);
                    imprimir.push("\>>Error semántico en linea " + this.fila + ", No es posible efectuar la operación, tipo de dato inválido\n");
                    return null;
                }
            } else {
                if (this.op1 instanceof Acceso) {
                    const simbolo = ent.getSimbolo(this.op1.identificador);
                    if (typeof (simbolo.valor) === "object") {
                        var aux: any = [];
                        for (let i: number = 0; i < simbolo.valor.length; i++) {
                            if (typeof (simbolo.valor[i]) === "number") {
                                aux.push(Math.tan(simbolo.valor[i]));
                            } else {
                                let er = new Errores("Semántico", "No es posible efectuar la operación, tipo de dato invalido", this.fila, this.columna, ent.nombre);
                                errores.push(er);
                                imprimir.push("\>>Error semántico en linea " + this.fila + ", No es posible efectuar la operación, tipo de dato invalido\n");
                                return null;
                            }
                        }
                        return aux;
                    } else {
                        let er = new Errores("Semántico", "No es posible efectuar la operación, no es un arreglo", this.fila, this.columna, ent.nombre);
                        errores.push(er);
                        imprimir.push("\>>Error semántico en linea " + this.fila + ", No es posible efectuar la operación, no es un arreglo\n");
                        return null;
                    }
                } else if (this.op1 instanceof Arreglo) {
                    var aux: any = [];
                    var e = this.op1.getValorImplicito(ent, arbol, errores, imprimir);
                    for (let i: number = 0; i < e.length; i++) {
                        if (typeof (e[i]) === "number") {
                            aux.push(Math.tan(e[i]));
                        } else {
                            let er = new Errores("Semántico", "No es posible efectuar la operación, tipo de dato invalido", this.fila, this.columna, ent.nombre);
                            errores.push(er);
                            imprimir.push("\>>Error semántico en linea " + this.fila + ", No es posible efectuar la operación, tipo de dato invalido\n");
                            return null;
                        }
                    }
                    return aux;
                } else {
                    let er = new Errores("Semántico", "No es posible efectuar la operación, no es un arreglo", this.fila, this.columna, ent.nombre);
                    errores.push(er);
                    imprimir.push("\>>Error semántico en linea " + this.fila + ", No es posible efectuar la operación, no es un arreglo\n");
                    return null;
                }
            }
        } else if (this.funcion == FuncionT.RAIZ) {
            if (!this.esArreglo) {
                if (typeof (valor) === "number") {
                    return Math.sqrt(valor);
                } else {
                    let er = new Errores("Semántico", "No es posible efectuar la operación, tipo de dato inválido", this.fila, this.columna, ent.nombre);
                    errores.push(er);
                    imprimir.push("\>>Error semántico en linea " + this.fila + ", No es posible efectuar la operación, tipo de dato inválido\n");
                    return null;
                }
            } else {
                if (this.op1 instanceof Acceso) {
                    const simbolo = ent.getSimbolo(this.op1.identificador);
                    if (typeof (simbolo.valor) === "object") {
                        var aux: any = [];
                        for (let i: number = 0; i < simbolo.valor.length; i++) {
                            if (typeof (simbolo.valor[i]) === "number") {
                                aux.push(Math.sqrt(simbolo.valor[i]));
                            } else {
                                let er = new Errores("Semántico", "No es posible efectuar la operación, tipo de dato invalido", this.fila, this.columna, ent.nombre);
                                errores.push(er);
                                imprimir.push("\>>Error semántico en linea " + this.fila + ", No es posible efectuar la operación, tipo de dato invalido\n");
                                return null;
                            }
                        }
                        return aux;
                    } else {
                        let er = new Errores("Semántico", "No es posible efectuar la operación, no es un arreglo", this.fila, this.columna, ent.nombre);
                        errores.push(er);
                        imprimir.push("\>>Error semántico en linea " + this.fila + ", No es posible efectuar la operación, no es un arreglo\n");
                        return null;
                    }
                } else if (this.op1 instanceof Arreglo) {
                    var aux: any = [];
                    var e = this.op1.getValorImplicito(ent, arbol, errores, imprimir);
                    for (let i: number = 0; i < e.length; i++) {
                        if (typeof (e[i]) === "number") {
                            aux.push(Math.sqrt(e[i]));
                        } else {
                            let er = new Errores("Semántico", "No es posible efectuar la operación, tipo de dato invalido", this.fila, this.columna, ent.nombre);
                            errores.push(er);
                            imprimir.push("\>>Error semántico en linea " + this.fila + ", No es posible efectuar la operación, tipo de dato invalido\n");
                            return null;
                        }
                    }
                    return aux;
                } else {
                    let er = new Errores("Semántico", "No es posible efectuar la operación, no es un arreglo", this.fila, this.columna, ent.nombre);
                    errores.push(er);
                    imprimir.push("\>>Error semántico en linea " + this.fila + ", No es posible efectuar la operación, no es un arreglo\n");
                    return null;
                }
            }
        } else if (this.funcion == FuncionT.LOG10) {
            if (!this.esArreglo) {
                if (typeof (valor) === "number") {
                    return Math.log10(valor);
                } else {
                    let er = new Errores("Semántico", "No es posible efectuar la operación, tipo de dato inválido", this.fila, this.columna, ent.nombre);
                    errores.push(er);
                    imprimir.push("\>>Error semántico en linea " + this.fila + ", No es posible efectuar la operación, tipo de dato inválido\n");
                    return null;
                }
            } else {
                if (this.op1 instanceof Acceso) {
                    const simbolo = ent.getSimbolo(this.op1.identificador);
                    if (typeof (simbolo.valor) === "object") {
                        var aux: any = [];
                        for (let i: number = 0; i < simbolo.valor.length; i++) {
                            if (typeof (simbolo.valor[i]) === "number") {
                                aux.push(Math.log10(simbolo.valor[i]));
                            } else {
                                let er = new Errores("Semántico", "No es posible efectuar la operación, tipo de dato invalido", this.fila, this.columna, ent.nombre);
                                errores.push(er);
                                imprimir.push("\>>Error semántico en linea " + this.fila + ", No es posible efectuar la operación, tipo de dato invalido\n");
                                return null;
                            }
                        }
                        return aux;
                    } else {
                        let er = new Errores("Semántico", "No es posible efectuar la operación, no es un arreglo", this.fila, this.columna, ent.nombre);
                        errores.push(er);
                        imprimir.push("\>>Error semántico en linea " + this.fila + ", No es posible efectuar la operación, no es un arreglo\n");
                        return null;
                    }
                } else if (this.op1 instanceof Arreglo) {
                    var aux: any = [];
                    var e = this.op1.getValorImplicito(ent, arbol, errores, imprimir);
                    for (let i: number = 0; i < e.length; i++) {
                        if (typeof (e[i]) === "number") {
                            aux.push(Math.log10(e[i]));
                        } else {
                            let er = new Errores("Semántico", "No es posible efectuar la operación, tipo de dato invalido", this.fila, this.columna, ent.nombre);
                            errores.push(er);
                            imprimir.push("\>>Error semántico en linea " + this.fila + ", No es posible efectuar la operación, tipo de dato invalido\n");
                            return null;
                        }
                    }
                    return aux;
                } else {
                    let er = new Errores("Semántico", "No es posible efectuar la operación, no es un arreglo", this.fila, this.columna, ent.nombre);
                    errores.push(er);
                    imprimir.push("\>>Error semántico en linea " + this.fila + ", No es posible efectuar la operación, no es un arreglo\n");
                    return null;
                }
            }
        }
        return null;
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