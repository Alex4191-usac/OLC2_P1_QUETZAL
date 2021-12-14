import {AST} from "../ast/AST";
import {Entorno} from "../ast/Entorno";
import { Traduccion } from "ast/Traduccion";
export interface Instruccion{
    fila: number;
    columna: number;
    ejecutar(ent: Entorno, arbol: AST, errores: any, imprimir: any): any;
    traducir(ent: Entorno, arbol: AST, trad: Traduccion): any;
}