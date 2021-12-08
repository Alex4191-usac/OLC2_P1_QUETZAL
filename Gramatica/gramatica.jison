%{
    //Importaciones

%}

%lex

%options case-sensitive

%%

//comentarios
("/""/".*\r\n)|("/""/".*\n)|("/""/".*\r)    /*Se ignoran comentarios simples*/
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]         /*Se ignoran comentarios multiples*/


//Simbolos
"." return 'PUNTO'
"," return 'COMA'
";" return 'PUNTOYCOMA'
"{" return 'LLAVEIZQ'
"}" return 'LLAVEDER'
"(" return 'PARIZQ'
")" return 'PARDER'
"[" return 'CORIZQ'
"]" return 'CORDER'
"++" return 'MASMAS'
"--" return 'MENOSMENOS'
"+" return 'MAS'
"-" return 'MENOS'
"*" return 'POR'
"/" return 'DIV'
"%" return 'MOD'
"==" return 'IGUALIGUAL'
"=" return 'IGUAL'
"!=" return 'NOIGUAL'
">=" return 'MAYORIGUAL'
"<=" return 'MENORIGUAL'
">" return 'MAYORQUE'
"<" return 'MENORQUE'
"&&" return 'AND'
"||" return 'OR'
"!" return 'NOT'
"&" return 'CONCAT'
"^" return 'POTENCIA'
"?" return 'TERNARIO'
":" return 'DOSPUNTOS'
"$" return 'DOLAR'
"#" return 'HASHTAG'

//Palabras Reservadas
"null" return 'RNULL'
"true" return 'RTRUE'
"false" return 'RFALSE'
"int" return 'RINT'
"double" return 'RDOUBLE'
"boolean" return 'RBOOLEAN'
"char" return 'RCHAR'
"String" return 'RSTRING'
"struct" return 'RSTRUCT'
"void" return 'RVOID'
"pow" return 'RPOW'
"sqrt" return 'RSQRT'
"sin" return 'RSIN'
"cos" return 'RCOS'
"tan" return 'RTAN'
"log10" return 'RLOG10'
"caracterOfPosition" return 'RCARACTEROFPOSITION'
"subString" return 'RSUBSTRING'
"length" return 'RLENGTH'
"toUppercase" return 'RTOUPPER'
"toLowercase" return 'RTOLOWER'
"println" return 'RPRINTLN'
"print" return 'RPRINT'
"parse" return 'RPARSE'
"toInt" return 'RTOINT'
"toDouble" return 'RTODOUBLE'
"string" return 'RSTRINGMIN'
"typeof" return 'RTYPEOF'
"function" return 'RFUNCTION'
"return" return 'RRETURN'
"if" return 'RIF'
"else" return 'RELSE'
"switch" return 'RSWITCH'
"case" return 'RCASE'
"break" return 'RBREAK'
"continue" return 'RCONTINUE'
"default" return 'RDEFAULT'
"while" return 'RWHILE'
"do" return 'RDO'
"for" return 'RFOR'
"in" return 'RIN'
"begin" return 'RBEGIN'
"end" return 'REND'
"push" return 'RPUSH'
"pop" return 'RPOP'
"main" return 'RMAIN'

//ERs

[ \n\r\t]+                          /*Se ignoran espacios en blanco*/
[\"]([^\"\n]|(\\\")|(\\\'))*[\"]    %{ return 'CADENA'; %}
[\'][^\'\n][\']                     %{ return 'CARACTER'; %}
[0-9]+[.][0-9]+                 %{ return 'DECIMAL'; %}
[0-9]+                          %{ return 'ENTERO'; %}
[a-zA-Z"_"]+["_"0-9A-Za-z]*         %{ return 'IDENTIFICADOR'; %}

<<EOF>>                             return 'EOF';

. { console.error("Error lexico: " + yytext + ", en linea: " + yylloc.first_line + ", y columna: " + yylloc.first_column + "\n"); }

/lex

//Precedencia de Operadores
%left 'OR'
%left 'AND'
%left 'MENORQUE' 'MENORIGUAL' 'MAYORQUE' 'MAYORIGUAL' 'IGUALIGUAL' 'NOIGUAL'
%left 'MAS' 'MENOS'
%left 'POR' 'DIV' 'MOD'
%left 'RPOW' 'RSQRT'
%left 'NOT'
%left UMINUS
%left 'PARIZQ' 'PARDER'

//Produccion inicial
%start inicio

%%
inicio : lista_bloques EOF
;

lista_bloques
    : lista_bloques bloque
    | bloque
;
bloque
    : asignacion
    | declaracion 
    | structs 
    | funciones 
    | metodos
;
instrucciones
    : instrucciones instruccion
    | instruccion 
;
instruccion
    : imprimir // aqui dentro va print y println
    | declaracion 
    | asignacion
    | if 
    | switch 
    | while
    | do_while
    | for
    | RBREAK PUNTOYCOMA
    | RCONTINUE PUNTOYCOMA
    | RRETURN PUNTOYCOMA
    | RRETURN expresion PUNTOYCOMA
;

funciones // int edad(int calculo1, int calculo2).....
    :tipo_dato IDENTIFICADOR PARIZQ parametros PARDER LLAVEIZQ instruccion LLAVEDER
;


parametros
    : lista_parametros COMA params
    | params
;

params 
    : tipo_dato IDENTIFICADOR

asignacion
    :| IDENTIFICADOR IGUAL expresion

tipo_dato
    : RINT
    | RDOUBLE
    | RBOOLEAN
    | RSTRING
    | RCHAR
    | RVOID
    | error
;      

expresion
    : 
;