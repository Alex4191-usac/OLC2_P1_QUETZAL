import {AST} from "../ast/AST"
import { Entorno } from "../ast/Entorno"
import { Instruccion } from "../interfaces/Instruccion" 
import { Expresion } from "../interfaces/Expresion"
import { Errores } from '../ast/Error';
import { Simbolo } from "../ast/Simbolo";
import { Acceso } from '../expresiones/Acceso';
import { Traduccion } from "../ast/Traduccion";



export class AsignacionAtributo implements Instruccion {

    idStruct: Array<Acceso>;
    atributo: string;
    valor: Expresion;
    fila: number;
    columna: number;

    constructor(idStruct: Array<Acceso>, atributo: string, valor: Expresion, fila: number, columna: number) {
        this.idStruct = idStruct;
        this.atributo = atributo;
        this.valor = valor;
        this.fila = fila;
        this.columna = columna;
    }
    
    ejecutar(ent: Entorno, arbol: AST, errores: any, imprimir: any) {
        throw new Error('Method not implemented.');
    }
    traducir(ent: Entorno, arbol: AST, trad: Traduccion) {
        throw new Error('Method not implemented.');
    }
}