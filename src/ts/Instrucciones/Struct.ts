import {AST} from "../ast/AST"
import { Entorno } from "../ast/Entorno"
import { Instruccion } from "../interfaces/Instruccion" 
import { Expresion } from "../interfaces/Expresion"
import { Errores } from '../ast/Error';
import { Simbolo } from "../ast/Simbolo";
import { Atributo } from '../expresiones/Atributo';

export class Struct implements Instruccion {
    
    nombreStruct: string;
    listadoAtributos: Atributo[];
    fila: number;
    columna: number;
    
    constructor(nombreStruct: string, listadoAtributos: Atributo[],fila: number, columna: number) {
        this.nombreStruct = nombreStruct;
        this.listadoAtributos = listadoAtributos;
        this.fila = fila;
        this.columna = columna;

    }
    
    ejecutar(ent: Entorno, arbol: AST, errores: any, imprimir: any) {
        throw new Error("Method not implemented.");
    }
    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }
}