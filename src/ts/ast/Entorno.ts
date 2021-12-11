import {Simbolo} from './Simbolo';

export class Entorno{

    private anterior: Entorno;
    public tabla: { [id: string]: Simbolo };
    public nombre: string;

    constructor(anterior: any, nombre: string) {
        this.tabla = {};
        this.anterior = anterior;
        this.nombre = nombre
    }
    agregar(id: string, simbolo: Simbolo) {
        id = id.toLowerCase();
        simbolo.identificador = simbolo.identificador.toLowerCase();
        this.tabla[id] = simbolo;
    }

    eliminar(id: string): boolean {
        id = id.toLowerCase();
        for (let e: Entorno = this; e != null; e = e.anterior) {
            const value = e.tabla[id]
            if (value !== undefined) {
                delete e.tabla[id];
                return true;
            }
        }
        return false;
    }

    existe(id: string): boolean {
        id = id.toLowerCase();
        for (let e: Entorno = this; e != null; e = e.anterior) {
            const value = e.tabla[id]
            if (value !== undefined) {
                return true;
            }
        }
        return false;
    }

    existeEnActual(id: string): boolean {
        id = id.toLowerCase();
        if (this.tabla[id] !== undefined) {
            return true;
        }
        return false;
    }

    getSimbolo(id: string): any {
        id = id.toLowerCase();
        for (let e: Entorno = this; e != null; e = e.anterior) {
            if (e.tabla[id] !== undefined) {
                return e.tabla[id];
            }
        }
        return null;
    }

    reemplazar(id: string, nuevoValor: Simbolo) {
        id = id.toLowerCase();
        for (let e: Entorno = this; e != null; e = e.anterior) {
            const value = e.tabla[id]
            if (value !== undefined) {
                e.tabla[id] = nuevoValor;
            }
        }
    }

}