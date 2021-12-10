import * as parser from 'parser'

import {AST} from './ast/AST';
import {Entorno} from './ast/Entorno';
import {Instruccion} from './interfaces/Instruccion';

const compileBtn = document.getElementById('runtimeBtn')
compileBtn?.addEventListener('click', () => {
  var codigo = (<HTMLInputElement>document.getElementById('txtEntrada')).value;
  try {
    console.log(codigo);
    var respuesta = parser.parse(codigo)
    console.log(respuesta);
  } catch(error) {
    console.log("Error al analizar" , error);
  }
})

export default {}
