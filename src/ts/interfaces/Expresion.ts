import {AST} from "../ast/AST";
import { Tipo } from "../AST/Tipo";
import {Entorno} from "../ast/Entorno";
import { Traduccion } from '../ast/Traduccion';

export interface Expresion{
    
    fila: number;
    columna: number;
    getTipo(ent: Entorno, arbol: AST, errores: any, imprimir: any): Tipo;
    getValorImplicito(ent: Entorno, arbol: AST, errores: any, imprimir: any): any;
    
    traducir(ent: Entorno, arbol: AST, trad: Traduccion): any;

}