import {AST} from "../ast/AST"
import { Entorno } from "../ast/Entorno"
import { Instruccion } from "../interfaces/Instruccion" 
import { Expresion } from "../interfaces/Expresion"
import { Errores } from '../ast/Error';
import { Simbolo } from "../ast/Simbolo";
import { Parametro } from '../expresiones/Parametro';

export class Funcion implements Instruccion {


    tipo: string;
    nombreFuncion: string;
    listaParametros: Array<Parametro>;
    listaInstrucciones: Array<Instruccion>;
    fila: number;
    columna: number;

    constructor(tipo: string, nombreFuncion: string, listaParametros: Array<Parametro>, listaInstrucciones: Array<Instruccion>, fila: number, columna: number) {
        this.tipo = tipo;
        this.nombreFuncion = nombreFuncion;
        this.listaParametros = listaParametros;
        this.listaInstrucciones = listaInstrucciones;
        this.fila = fila;
        this.columna = columna;
    }

    ejecutar(ent: Entorno, arbol: AST, errores: any, imprimir: any) {
        //Falta agregar toda la mecánica de los parámetros etc
        if (this.listaInstrucciones.length > 0) {
            const entorno = new Entorno(ent, this.nombreFuncion);
            this.listaInstrucciones.forEach(inst => {
                inst.ejecutar(entorno, arbol, errores, imprimir);
            });
        }
    }
    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }
}