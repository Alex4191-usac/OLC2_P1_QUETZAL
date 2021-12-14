import {AST} from "../ast/AST"
import { Entorno } from "../ast/Entorno"
import { Instruccion } from "../interfaces/Instruccion" 
import { Expresion } from "../interfaces/Expresion"
import { Errores } from '../ast/Error';
import { Simbolo } from "../ast/Simbolo";
import { Acceso } from '../expresiones/Acceso';
import { Aritmetica } from '../expresiones/Aritmetica';
import { Traduccion } from "../ast/Traduccion";
import { Break } from './Break';
import { Continue } from './Continue';
import { Funcion } from './Funcion';
import { Struct } from './Struct';
import { Return } from './Return';

export class Llamada implements Instruccion {

    public nombreFuncion: Acceso;
    public argumentos: Array<any>;
    fila: number;
    columna: number;

    constructor(nombreFuncion: Acceso, argumentos: Array<any>, fila: number, columna: number) {
        this.nombreFuncion = nombreFuncion;
        this.argumentos = argumentos;
        this.fila = fila;
        this.columna = columna;
    }

    ejecutar(ent: Entorno, arbol: AST, errores: any, imprimir: any) {
        const e = ent.getEntorno("Global", ent);
        if (e !== null) {
            const f = e.getFuncion(this.nombreFuncion.identificador);
            if (f !== null) {
                if (f.valor instanceof Funcion) {
                    const entorno = new Entorno(ent, this.nombreFuncion.identificador);
                    if (this.argumentos.length > 0) {
                        if (f.valor.listaParametros.length === this.argumentos.length) {
                            for (let i: number = 0; i < this.argumentos.length; i++) {
                                var tipoargu;
                                if (this.argumentos[i] instanceof Llamada) {
                                    tipoargu = this.argumentos[i].nombreFuncion.getTipo(entorno, arbol, errores, imprimir);
                                } else {
                                    tipoargu = this.argumentos[i].getTipo(entorno, arbol, errores, imprimir);
                                }
                                let tipopara = f.valor.listaParametros[i].tipo;
                                if (tipoargu === tipopara) {
                                    let argu;
                                    if (this.argumentos[i] instanceof Llamada) {
                                        argu = this.argumentos[i].ejecutar(entorno, arbol, errores, imprimir);
                                    } else {
                                        argu = this.argumentos[i].getValorImplicito(entorno, arbol, errores, imprimir);
                                    }
                                    let param = f.valor.listaParametros[i].identificador[0];
                                    let simbolo: Simbolo = new Simbolo(tipopara, param, argu, this.fila, this.columna);
                                    entorno.agregar(param, simbolo);
                                } else {
                                    let er = new Errores("Semántico", "El tipo de dato enviado no es igual al que se recibe", this.fila, this.columna, ent.nombre);
                                    errores.push(er);
                                    imprimir.push("\n>>Error semántico en linea " + this.fila + ", El tipo de dato enviado no es igual al que se recibe\n");
                                    return null
                                }
                            }
                            var resp = f.valor.ejecutar(entorno, arbol, errores, imprimir);
                            if (resp instanceof Return) return resp.expresion;
                            if (resp instanceof Break || resp instanceof Continue) {
                                let er = new Errores("Semántico", "No es posible utilizar la instruccion dentro de una función", this.fila, this.columna, ent.nombre);
                                errores.push(er);
                                imprimir.push("\n>>Error semántico en linea " + this.fila + ", No es posible utilizar la instruccion dentro de una función\n");
                                return null
                            }
                        } else {
                            let er = new Errores("Semántico", "La cantidad de parámetros no coincide", this.fila, this.columna, ent.nombre);
                            errores.push(er);
                            imprimir.push("\n>>Error semántico en linea " + this.fila + ", La cantidad de parámetros no coincide\n");
                            return null
                        }
                    } else {
                        var resp = f.valor.ejecutar(entorno, arbol, errores, imprimir);
                        if (resp instanceof Return) return resp.expresion;
                        if (resp instanceof Break || resp instanceof Continue) {
                            let er = new Errores("Semántico", "No es posible utilizar la instruccion dentro de una función", this.fila, this.columna, ent.nombre);
                            errores.push(er);
                            imprimir.push("\n>>Error semántico en linea " + this.fila + ", No es posible utilizar la instruccion dentro de una función\n");
                            return null
                        }
                    }
                } else if (f.valor instanceof Struct) {

                } else {
                    let er = new Errores("Semántico", "Instrucción no reconocida", this.fila, this.columna, ent.nombre);
                    errores.push(er);
                    imprimir.push("\n>>Error semántico en linea " + this.fila + ", Instrucción no reconocida\n");
                    return null
                }
            } else {
                let er = new Errores("Semántico", this.nombreFuncion + " no existe", this.fila, this.columna, ent.nombre);
                errores.push(er);
                imprimir.push("\n>>Error semántico en linea " + this.fila + ", " + this.nombreFuncion + " no existe\n");
                return er
            }
        }
    }

    traducir(ent: Entorno, arbol: AST, trad: Traduccion) {
        throw new Error("Method not implemented.");
    }
}