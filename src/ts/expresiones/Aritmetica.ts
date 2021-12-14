import { AST } from '../ast/AST';
import { Entorno } from '../ast/Entorno';
import { Tipo } from '../ast/Tipo';
import { Expresion } from '../interfaces/Expresion';
import { Traduccion } from '../ast/Traduccion';
import { Errores } from '../ast/Error';
import { Acceso } from './Acceso';
import { Arreglo } from './Arreglo';


export enum OperadorA {
    SUMA,
    RESTA,
    MULTIPLICACION,
    DIVISION,
    MOD,
    POW,
    UNARIO,
    CONCAT,
    POTENCIA,
    INCREMENTO,
    DECREMENTO
}

export class Aritmetica implements Expresion {
    fila: number;
    columna: number;
    public op1: Expresion;
    op2: Expresion;
    operador: OperadorA;
    esArray: boolean;

    constructor(op1: Expresion, op2: Expresion, operador: OperadorA, fila: number, columna: number, esArray: boolean = false) {
        this.op1 = op1;
        this.op2 = op2;
        this.operador = operador;
        this.fila = fila;
        this.columna = columna;
        this.esArray = esArray;
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

    public getValorImplicito(ent: Entorno, arbol: AST, errores: any, imprimir: any) {
        if (!this.esArray) {
            if (this.operador !== OperadorA.UNARIO && this.operador !== OperadorA.INCREMENTO && this.operador !== OperadorA.DECREMENTO) {
                let op1 = this.op1.getValorImplicito(ent, arbol, errores, imprimir);
                let op2 = this.op2.getValorImplicito(ent, arbol, errores, imprimir);

                if (this.operador == OperadorA.SUMA) {

                    if (typeof (op1) === "number" && typeof (op2) === "number") {
                        return op1 + op2;
                    } else if (typeof (op1) === "number" && typeof (op2) === "string") {
                        if (this.esChar(op2)) {
                            return op2.charCodeAt(0) + op1;
                        } else {
                            let er = new Errores("Semantico", "Los tipos de datos no son compatibles para sumar", this.fila, this.columna, ent.nombre);
                            errores.push(er);
                            imprimir.push("\n>>Error semántico en linea " + this.fila + ", Los tipos de datos no son compatibles para sumar\n");
                            return null;
                        }
                    } else if (typeof (op2) === "number" && typeof (op1) === "string") {
                        if (this.esChar(op1)) {
                            return op1.charCodeAt(0) + op2;
                        } else {
                            let er = new Errores("Semantico", "Los tipos de datos no son compatibles para sumar", this.fila, this.columna, ent.nombre);
                            errores.push(er);
                            imprimir.push("\n>>Error semántico en linea " + this.fila + ", Los tipos de datos no son compatibles para sumar\n");
                            return null;
                        }
                    } else if (typeof (op1) === "string" && typeof (op2) === "string") {
                        if (this.esChar(op1) && this.esChar(op2)) {
                            return op1.charCodeAt(0) + op2.charCodeAt(0);
                        } else {
                            let er = new Errores("Semantico", "Los tipos de datos no son compatibles para sumar", this.fila, this.columna, ent.nombre);
                            errores.push(er);
                            imprimir.push("\n>>Error semántico en linea " + this.fila + ", Los tipos de datos no son compatibles para sumar\n");
                            return null;
                        }
                    } else if (typeof (op1) === "object" && typeof (op2) === "number") {
                        var aux: any = [];
                        for (let i: number = 0; i < op1.length; i++) {
                            if (typeof (op1[i]) === "number") {
                                aux.push(op1[i] + op2);
                            } else {
                                let er = new Errores("Semántico", "No es posible efectuar la operación, tipo de dato invalido", this.fila, this.columna, ent.nombre);
                                errores.push(er);
                                imprimir.push("\>>Error semántico en linea " + this.fila + ", No es posible efectuar la operación, tipo de dato invalido\n");
                                return null;
                            }
                        }
                        return aux;
                    } else {
                        let er = new Errores("Semantico", "Los tipos de datos no son compatibles para sumar", this.fila, this.columna, ent.nombre);
                        errores.push(er);
                        imprimir.push("\n>>Error semántico en linea " + this.fila + ", Los tipos de datos no son compatibles para sumar\n");
                        return null;
                    }

                } else if (this.operador == OperadorA.RESTA) {

                    if (typeof (op1) === "number" && typeof (op2) === "number") {
                        return op1 - op2;
                    } else if (typeof (op1) === "number" && typeof (op2) === "string") {
                        if (this.esChar(op2)) {
                            return op1 - op2.charCodeAt(0);
                        } else {
                            let er = new Errores("Semantico", "Los tipos de datos no son compatibles para restar", this.fila, this.columna, ent.nombre);
                            errores.push(er);
                            imprimir.push("\n>>Error semántico en linea " + this.fila + ", Los tipos de datos no son compatibles para restar\n");
                            return null;
                        }
                    } else if (typeof (op2) === "number" && typeof (op1) === "string") {
                        if (this.esChar(op1)) {
                            return op1.charCodeAt(0) - op2;
                        } else {
                            let er = new Errores("Semantico", "Los tipos de datos no son compatibles para restar", this.fila, this.columna, ent.nombre);
                            errores.push(er);
                            imprimir.push("\n>>Error semántico en linea " + this.fila + ", Los tipos de datos no son compatibles para restar\n");
                            return null;
                        }
                    } else if (typeof (op1) === "string" && typeof (op2) === "string") {
                        if (this.esChar(op1) && this.esChar(op2)) {
                            return op1.charCodeAt(0) - op2.charCodeAt(0);
                        } else {
                            let er = new Errores("Semantico", "Los tipos de datos no son compatibles para restar", this.fila, this.columna, ent.nombre);
                            errores.push(er);
                            imprimir.push("\n>>Error semántico en linea " + this.fila + ", Los tipos de datos no son compatibles para restar\n");
                            return null;
                        }
                    } else if (typeof (op1) === "object" && typeof (op2) === "number") {
                        var aux: any = [];
                        for (let i: number = 0; i < op1.length; i++) {
                            if (typeof (op1[i]) === "number") {
                                aux.push(op1[i] - op2);
                            } else {
                                let er = new Errores("Semántico", "No es posible efectuar la operación, tipo de dato invalido", this.fila, this.columna, ent.nombre);
                                errores.push(er);
                                imprimir.push("\>>Error semántico en linea " + this.fila + ", No es posible efectuar la operación, tipo de dato invalido\n");
                                return null;
                            }
                        }
                        return aux;
                    } else {
                        let er = new Errores("Semantico", "Los tipos de datos no son compatibles para restar", this.fila, this.columna, ent.nombre);
                        errores.push(er);
                        imprimir.push("\n>>Error semántico en linea " + this.fila + ", Los tipos de datos no son compatibles para restar\n");
                        return null;
                    }

                } else if (this.operador == OperadorA.MULTIPLICACION) {

                    if (typeof (op1) === "number" && typeof (op2) === "number") {
                        return op1 * op2;
                    } else if (typeof (op1) === "number" && typeof (op2) === "string") {
                        if (this.esChar(op2)) {
                            return op1 * op2.charCodeAt(0);
                        } else {
                            let er = new Errores("Semantico", "Los tipos de datos no son compatibles para multiplicar", this.fila, this.columna, ent.nombre);
                            errores.push(er);
                            imprimir.push("\n>>Error semántico en linea " + this.fila + ", Los tipos de datos no son compatibles para multiplicar\n");
                            return null;
                        }
                    } else if (typeof (op2) === "number" && typeof (op1) === "string") {
                        if (this.esChar(op1)) {
                            return op1.charCodeAt(0) * op2;
                        } else {
                            let er = new Errores("Semantico", "Los tipos de datos no son compatibles para multiplicar", this.fila, this.columna, ent.nombre);
                            errores.push(er);
                            imprimir.push("\n>>Error semántico en linea " + this.fila + ", Los tipos de datos no son compatibles para multiplicar\n");
                            return null;
                        }
                    } else if (typeof (op1) === "string" && typeof (op2) === "string") {
                        if (this.esChar(op1) && this.esChar(op2)) {
                            return op1.charCodeAt(0) * op2.charCodeAt(0);
                        } else {
                            let er = new Errores("Semantico", "Los tipos de datos no son compatibles para multiplicar", this.fila, this.columna, ent.nombre);
                            errores.push(er);
                            imprimir.push("\n>>Error semántico en linea " + this.fila + ", Los tipos de datos no son compatibles para multiplicar\n");
                            return null;
                        }
                    } else if (typeof (op1) === "object" && typeof (op2) === "number") {
                        var aux: any = [];
                        for (let i: number = 0; i < op1.length; i++) {
                            if (typeof (op1[i]) === "number") {
                                aux.push(op1[i] * op2);
                            } else {
                                let er = new Errores("Semántico", "No es posible efectuar la operación, tipo de dato invalido", this.fila, this.columna, ent.nombre);
                                errores.push(er);
                                imprimir.push("\>>Error semántico en linea " + this.fila + ", No es posible efectuar la operación, tipo de dato invalido\n");
                                return null;
                            }
                        }
                        return aux;
                    } else {
                        let er = new Errores("Semantico", "Los tipos de datos no son compatibles para multiplicar", this.fila, this.columna, ent.nombre);
                        errores.push(er);
                        imprimir.push("\n>>Error semántico en linea " + this.fila + ", Los tipos de datos no son compatibles para multiplicar\n");
                        return null;
                    }

                } else if (this.operador == OperadorA.DIVISION) {

                    if (typeof (op1) === "number" && typeof (op2) === "number") {
                        if (op2 != 0) {
                            return op1 / op2;
                        } else {
                            let er = new Errores("Semantico", "No es posible dividir entre 0", this.fila, this.columna, ent.nombre);
                            errores.push(er);
                            imprimir.push("\n>>Error semántico en linea " + this.fila + ", No es posible dividir entre 0\n");
                            return null;
                        }
                    } else if (typeof (op1) === "number" && typeof (op2) === "string") {
                        if (this.esChar(op2)) {
                            if (op2.charCodeAt(0) != 0) {
                                return op1 / op2.charCodeAt(0);
                            } else {
                                let er = new Errores("Semantico", "No es posible dividir entre 0", this.fila, this.columna, ent.nombre);
                                errores.push(er);
                                imprimir.push("\n>>Error semántico en linea " + this.fila + ", No es posible dividir entre 0\n");
                                return null;
                            }
                        } else {
                            let er = new Errores("Semantico", "Los tipos de datos no son compatibles para dividir", this.fila, this.columna, ent.nombre);
                            errores.push(er);
                            imprimir.push("\n>>Error semántico en linea " + this.fila + ", Los tipos de datos no son compatibles para dividir\n");
                            return null;
                        }
                    } else if (typeof (op2) === "number" && typeof (op1) === "string") {
                        if (this.esChar(op1)) {
                            if (op2 != 0) {
                                return op1.charCodeAt(0) / op2;
                            } else {
                                let er = new Errores("Semantico", "No es posible dividir entre 0", this.fila, this.columna, ent.nombre);
                                errores.push(er);
                                imprimir.push("\n>>Error semántico en linea " + this.fila + ", No es posible dividir entre 0\n");
                                return null;
                            }
                        } else {
                            let er = new Errores("Semantico", "Los tipos de datos no son compatibles para dividir", this.fila, this.columna, ent.nombre);
                            errores.push(er);
                            imprimir.push("\n>>Error semántico en linea " + this.fila + ", Los tipos de datos no son compatibles para dividir\n");
                            return null;
                        }
                    } else if (typeof (op1) === "string" && typeof (op2) === "string") {
                        if (this.esChar(op1) && this.esChar(op2)) {
                            if (op2.charCodeAt(0) != 0) {
                                return op1.charCodeAt(0) / op2.charCodeAt(0);
                            } else {
                                let er = new Errores("Semantico", "No es posible dividir entre 0", this.fila, this.columna, ent.nombre);
                                errores.push(er);
                                imprimir.push("\n>>Error semántico en linea " + this.fila + ", No es posible dividir entre 0\n");
                                return null;
                            }
                        } else {
                            let er = new Errores("Semantico", "Los tipos de datos no son compatibles para dividir", this.fila, this.columna, ent.nombre);
                            errores.push(er);
                            imprimir.push("\n>>Error semántico en linea " + this.fila + ", Los tipos de datos no son compatibles para dividir\n");
                            return null;
                        }
                    } else if (typeof (op1) === "object" && typeof (op2) === "number") {
                        if (op2 !== 0) {
                            var aux: any = [];
                            for (let i: number = 0; i < op1.length; i++) {
                                if (typeof (op1[i]) === "number") {
                                    aux.push(op1[i] / op2);
                                } else {
                                    let er = new Errores("Semántico", "No es posible efectuar la operación, tipo de dato invalido", this.fila, this.columna, ent.nombre);
                                    errores.push(er);
                                    imprimir.push("\>>Error semántico en linea " + this.fila + ", No es posible efectuar la operación, tipo de dato invalido\n");
                                    return null;
                                }
                            }
                            return aux;
                        } else {
                            let er = new Errores("Semantico", "No es posible dividir entre 0", this.fila, this.columna, ent.nombre);
                            errores.push(er);
                            imprimir.push("\n>>Error semántico en linea " + this.fila + ", No es posible dividir entre 0\n");
                            return null;
                        }
                    } else {
                        let er = new Errores("Semantico", "Los tipos de datos no son compatibles para dividir", this.fila, this.columna, ent.nombre);
                        errores.push(er);
                        imprimir.push("\n>>Error semántico en linea " + this.fila + ", Los tipos de datos no son compatibles para dividir\n");
                        return null;
                    }

                } else if (this.operador == OperadorA.MOD) {

                    if (typeof (op1) === "number" && typeof (op2) === "number") {
                        if (op2 != 0) {
                            return op1 % op2;
                        } else {
                            let er = new Errores("Semantico", "No se puede dividir entre 0", this.fila, this.columna, ent.nombre);
                            errores.push(er);
                            imprimir.push("\n>>Error semántico en linea " + this.fila + ", No se puede dividir entre 0\n");
                            return null;
                        }
                    } else if (typeof (op1) === "number" && typeof (op2) === "string") {
                        if (this.esChar(op2)) {
                            if (op2.charCodeAt(0) != 0) {
                                return op1 % op2.charCodeAt(0);
                            } else {
                                let er = new Errores("Semantico", "No se puede dividir entre 0", this.fila, this.columna, ent.nombre);
                                errores.push(er);
                                imprimir.push("\n>>Error semántico en linea " + this.fila + ", No se puede dividir entre 0\n");
                                return null;
                            }
                        } else {
                            let er = new Errores("Semantico", "Los tipos de datos no son compatibles para aplicar modular", this.fila, this.columna, ent.nombre);
                            errores.push(er);
                            imprimir.push("\n>>Error semántico en linea " + this.fila + ", Los tipos de datos no son compatibles para aplicar modular\n");
                            return null;
                        }
                    } else if (typeof (op2) === "number" && typeof (op1) === "string") {
                        if (this.esChar(op1)) {
                            if (op2 != 0) {
                                return op1.charCodeAt(0) % op2;
                            } else {
                                let er = new Errores("Semantico", "No se puede dividir entre 0", this.fila, this.columna, ent.nombre);
                                errores.push(er);
                                imprimir.push("\n>>Error semántico en linea " + this.fila + ", No se puede dividir entre 0\n");
                                return null;
                            }
                        } else {
                            let er = new Errores("Semantico", "Los tipos de datos no son compatibles para aplicar modular", this.fila, this.columna, ent.nombre);
                            errores.push(er);
                            imprimir.push("\n>>Error semántico en linea " + this.fila + ", Los tipos de datos no son compatibles para aplicar modular\n");
                            return null;
                        }
                    } else if (typeof (op1) === "string" && typeof (op2) === "string") {
                        if (this.esChar(op1) && this.esChar(op2)) {
                            if (op2.charCodeAt(0) != 0) {
                                return op1.charCodeAt(0) % op2.charCodeAt(0);
                            } else {
                                let er = new Errores("Semantico", "No se puede dividir entre 0", this.fila, this.columna, ent.nombre);
                                errores.push(er);
                                imprimir.push("\n>>Error semántico en linea " + this.fila + ", No se puede dividir entre 0\n");
                                return null;
                            }
                        } else {
                            let er = new Errores("Semantico", "Los tipos de datos no son compatibles para aplicar modular", this.fila, this.columna, ent.nombre);
                            errores.push(er);
                            imprimir.push("\n>>Error semántico en linea " + this.fila + ", Los tipos de datos no son compatibles para aplicar modular\n");
                            return null;
                        }
                    } else if (typeof (op1) === "object" && typeof (op2) === "number") {
                        if (op2 !== 0) {
                            var aux: any = [];
                            for (let i: number = 0; i < op1.length; i++) {
                                if (typeof (op1[i]) === "number") {
                                    aux.push(op1[i] % op2);
                                } else {
                                    let er = new Errores("Semántico", "No es posible efectuar la operación, tipo de dato invalido", this.fila, this.columna, ent.nombre);
                                    errores.push(er);
                                    imprimir.push("\>>Error semántico en linea " + this.fila + ", No es posible efectuar la operación, tipo de dato invalido\n");
                                    return null;
                                }
                            }
                            return aux;
                        } else {
                            let er = new Errores("Semantico", "No es posible dividir entre 0", this.fila, this.columna, ent.nombre);
                            errores.push(er);
                            imprimir.push("\n>>Error semántico en linea " + this.fila + ", No es posible dividir entre 0\n");
                            return null;
                        }
                    } else {
                        let er = new Errores("Semantico", "Los tipos de datos no son compatibles para aplicar modular", this.fila, this.columna, ent.nombre);
                        errores.push(er);
                        imprimir.push("\n>>Error semántico en linea " + this.fila + ", Los tipos de datos no son compatibles para aplicar modular\n");
                        return null;
                    }

                } else if (this.operador == OperadorA.POW) {

                    if (typeof (op1) === "number" && typeof (op2) === "number") {
                        if (this.esEntero(op2)) {
                            return op1 ** op2;
                        } else {
                            let er = new Errores("Semantico", "No es permitido un exponente de tipo double", this.fila, this.columna, ent.nombre);
                            errores.push(er);
                            imprimir.push("\n>>Error semántico en linea " + this.fila + ", No es permitido un exponente de tipo double\n");
                            return null;
                        }
                    } else if (typeof (op1) === "number" && typeof (op2) === "string") {
                        if (this.esChar(op2)) {
                            return op1 ** op2.charCodeAt(0);
                        } else {
                            let er = new Errores("Semantico", "Los tipos de datos no son compatibles para aplicar potencia", this.fila, this.columna, ent.nombre);
                            errores.push(er);
                            imprimir.push("\n>>Error semántico en linea " + this.fila + ", Los tipos de datos no son compatibles para aplicar potencia\n");
                            return null;
                        }
                    } else if (typeof (op2) === "number" && typeof (op1) === "string") {
                        if (this.esChar(op1)) {
                            return op1.charCodeAt(0) ** op2;
                        } else {
                            let er = new Errores("Semantico", "Los tipos de datos no son compatibles para aplicar potencia", this.fila, this.columna, ent.nombre);
                            errores.push(er);
                            imprimir.push("\n>>Error semántico en linea " + this.fila + ", Los tipos de datos no son compatibles para aplicar potencia\n");
                            return null;
                        }
                    } else if (typeof (op1) === "string" && typeof (op2) === "string") {
                        if (this.esChar(op1) && this.esChar(op2)) {
                            return op1.charCodeAt(0) ** op2.charCodeAt(0);
                        } else {
                            let er = new Errores("Semantico", "Los tipos de datos no son compatibles para aplicar potencia", this.fila, this.columna, ent.nombre);
                            errores.push(er);
                            imprimir.push("\n>>Error semántico en linea " + this.fila + ", Los tipos de datos no son compatibles para aplicar potencia\n");
                            return null;
                        }
                    } else {
                        let er = new Errores("Semantico", "Los tipos de datos no son compatibles para aplicar potencia", this.fila, this.columna, ent.nombre);
                        errores.push(er);
                        imprimir.push("\n>>Error semántico en linea " + this.fila + ", Los tipos de datos no son compatibles para aplicar potencia\n");
                        return null;
                    }

                } else if (this.operador == OperadorA.CONCAT) {

                    return op1.toString() + op2.toString();

                } else if (this.operador == OperadorA.POTENCIA) {

                    if (typeof (op1) === "string" && typeof (op2) === "number") {
                        if (this.esEntero(op2)) {
                            let a = "";
                            for (let i: number = 0; i < Number(op2); i++) {
                                a += op1;
                            }
                            return a;
                        } else {
                            let er = new Errores("Semantico", "No es permitido un exponente de tipo double", this.fila, this.columna, ent.nombre);
                            errores.push(er);
                            imprimir.push("\n>>Error semántico en linea " + this.fila + ", No es permitido un exponente de tipo double\n");
                            return null;
                        }
                    } else if (typeof (op1) === "string" && typeof (op2) === "string") {
                        if (this.esChar(op2)) {
                            let a = "";
                            for (let i: number = 0; i < op2.charCodeAt(0); i++) {
                                a += op1;
                            }
                            return a;
                        } else {
                            let er = new Errores("Semantico", "Los tipos de datos no son compatibles para aplicar potencia", this.fila, this.columna, ent.nombre);
                            errores.push(er);
                            imprimir.push("\n>>Error semántico en linea " + this.fila + ", Los tipos de datos no son compatibles para aplicar potencia\n");
                            return null;
                        }
                    } else {
                        let er = new Errores("Semantico", "Los tipos de datos no son compatibles para aplicar potencia", this.fila, this.columna, ent.nombre);
                        errores.push(er);
                        imprimir.push("\n>>Error semántico en linea " + this.fila + ", Los tipos de datos no son compatibles para aplicar potencia\n");
                        return null;
                    }
                }

            } else {
                let op1 = this.op1.getValorImplicito(ent, arbol, errores, imprimir);

                if (this.operador == OperadorA.UNARIO) {

                    if (typeof (op1) === "number") {
                        return -1 * op1;
                    } else if (typeof (op1) === "string") {
                        if (this.esChar(op1)) {
                            return -1 * op1.charCodeAt(0);
                        } else {
                            let er = new Errores("Semantico", "El tipo de dato no puede ser negativo", this.fila, this.columna, ent.nombre);
                            errores.push(er);
                            imprimir.push("\n>>Error semántico en linea " + this.fila + ", El tipo de dato no puede ser negativo\n");
                            return null;
                        }
                    } else {
                        let er = new Errores("Semantico", "El tipo de dato no puede ser negativo", this.fila, this.columna, ent.nombre);
                        errores.push(er);
                        imprimir.push("\n>>Error semántico en linea " + this.fila + ", El tipo de dato no puede ser negativo\n");
                        return null;
                    }

                } else if (this.operador == OperadorA.INCREMENTO) {

                    if (typeof (op1) === "number") {
                        return op1 + 1;
                    } else if (typeof (op1) === "string") {
                        if (this.esChar(op1)) {
                            return op1.charCodeAt(0) + 1;
                        } else {
                            let er = new Errores("Semantico", "El tipo de dato no se puede incrementar", this.fila, this.columna, ent.nombre);
                            errores.push(er);
                            imprimir.push("\n>>Error semántico en linea " + this.fila + ", El tipo de dato no se puede incrementar\n");
                            return null;
                        }
                    } else {
                        let er = new Errores("Semantico", "El tipo de dato no se puede incrementar", this.fila, this.columna, ent.nombre);
                        errores.push(er);
                        imprimir.push("\n>>Error semántico en linea " + this.fila + ", El tipo de dato no se puede incrementar\n");
                        return null;
                    }

                } else if (this.operador == OperadorA.DECREMENTO) {

                    if (typeof (op1) === "number") {
                        return op1 - 1;
                    } else if (typeof (op1) === "string") {
                        if (this.esChar(op1)) {
                            return op1.charCodeAt(0) - 1;
                        } else {
                            let er = new Errores("Semantico", "El tipo de dato no se puede disminuir", this.fila, this.columna, ent.nombre);
                            errores.push(er);
                            imprimir.push("\n>>Error semántico en linea " + this.fila + ", El tipo de dato no se puede disminuir\n");
                            return null;
                        }
                    } else {
                        let er = new Errores("Semantico", "El tipo de dato no se puede disminuir", this.fila, this.columna, ent.nombre);
                        errores.push(er);
                        imprimir.push("\n>>Error semántico en linea " + this.fila + ", El tipo de dato no se puede disminuir\n");
                        return null;
                    }

                }
            }
        } else {
            if (this.operador == OperadorA.POW) {

                if (this.op1 instanceof Acceso) {
                    const simbolo = ent.getSimbolo(this.op1.identificador);
                    var pote = this.op2.getValorImplicito(ent, arbol, errores, imprimir);
                    if (typeof (simbolo.valor) === "object") {
                        var aux: any = [];
                        for (let i: number = 0; i < simbolo.valor.length; i++) {
                            if (typeof (simbolo.valor[i]) === "number") {
                                aux.push(simbolo.valor[i] ** pote);
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
                    var pote = this.op2.getValorImplicito(ent, arbol, errores, imprimir);
                    var aux: any = [];
                    var e = this.op1.getValorImplicito(ent, arbol, errores, imprimir);
                    for (let i: number = 0; i < e.length; i++) {
                        if (typeof (e[i]) === "number") {
                            aux.push(e[i] ** pote);
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

            } else {
                let er = new Errores("Semántico", "No es posible realizar esta operación", this.fila, this.columna, ent.nombre);
                errores.push(er);
                imprimir.push("\n>>Error semántico en linea " + this.fila + ", No es posible realizar esta operación\n");
                return null
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