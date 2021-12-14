import {AST} from "../ast/AST"
import { Entorno } from "../ast/Entorno"
import { Instruccion } from "../interfaces/Instruccion" 
import { Expresion } from "../interfaces/Expresion"
import { Errores } from '../ast/Error';
import { Simbolo } from "../ast/Simbolo";
import { Atributo } from '../expresiones/Atributo';
import { Tipo } from "../AST/Tipo";
import { Traduccion } from "../ast/Traduccion";



export class Struct implements Instruccion {

    nombreStruct: string;
    listadoAtributos: any[];
    fila: number;
    columna: number;
    yapaso: boolean;

    constructor(nombreStruct: string, listadoAtributos: any[], fila: number, columna: number, yapaso: boolean = false) {
        this.nombreStruct = nombreStruct;
        this.listadoAtributos = listadoAtributos;
        this.fila = fila;
        this.columna = columna;
        this.yapaso = yapaso;
    }

    ejecutar(ent: Entorno, arbol: AST, errores: any, imprimir: any) {
        if (ent.existe(this.nombreStruct)) {
            if (this.yapaso === true) {
                for (let i: number = 0; i < this.listadoAtributos.length; i++) {
                    this.listadoAtributos[i].ejecutar(ent, arbol, errores, imprimir);
                }
            } else {
                let err = new Errores("Semántico", "El nombre del struct ya está en uso.", this.fila, this.columna, ent.nombre);
                errores.push(err);
                imprimir.push("\n>>Error semántico en línea " + this.fila + ", El nombre del struct ya está en uso.");
                return err;
            }
        } else {
            let simbolo = new Simbolo(Tipo.STRUCT, this.nombreStruct, this.listadoAtributos, this.fila, this.columna);
            ent.agregar(this.nombreStruct, simbolo);
            this.yapaso = true;
        }
    }
    
    traducir(ent: Entorno, arbol: AST, trad: Traduccion) {
        throw new Error("Method not implemented.");
    }
}