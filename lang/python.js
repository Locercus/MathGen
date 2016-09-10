#!/usr/bin/env node

'use strict';

let imports = [];

function run(i) {
    let code = handler(i);
    let importsLine = imports.join('\n') + '\n\n';

    if (imports.length === 0)
        importsLine = '';

    return importsLine + code;
}

function handler(i) {
    if (i instanceof Array)
        return '';

    switch (i.constructor) {
        case VariableNode:
            return i.name;

        case NumberNode:
            return i.value;

        case FunctionNode:
            switch (i.name) {
                case 'abs':
                    return 'abs(' +
                        handler(i.value[0]) +
                    ')';

                case 'acos':
                    if (imports.indexOf('import math') === -1)
                        imports.push('import math');

                    return 'math.acos(' +
                        handler(i.value[0]) +
                    ')';

                case 'acosh':
                    if (imports.indexOf('import math') === -1)
                        imports.push('import math');

                    return 'math.acosh(' +
                        handler(i.value[0]) +
                    ')';

                case 'asin':
                    if (imports.indexOf('import math') === -1)
                        imports.push('import math');

                    return 'math.asin(' +
                        handler(i.value[0]) +
                    ')';

                case 'asinh':
                    if (imports.indexOf('import math') === -1)
                        imports.push('import math');
                    
                    return 'math.asinh(' +
                        handler(i.value[0]) +
                    ')';

                case 'atan':
                    if (imports.indexOf('import math') === -1)
                        imports.push('import math');
                    
                    return 'math.atan(' +
                        handler(i.value[0]) +
                    ')';

                case 'atanh':
                    if (imports.indexOf('import math') === -1)
                        imports.push('import math');
                    
                    return 'math.atanh(' +
                        handler(i.value[0]) +
                    ')';

                case 'cbrt':
                    if (imports.indexOf('import math') === -1)
                        imports.push('import math');
                    
                    return 'math.pow(' +
                        handler(i.value[0]) +
                        '1/3' +
                    ')';

                case 'ceil':
                    if (imports.indexOf('import math') === -1)
                        imports.push('import math');
                    
                    return 'math.ceil(' +
                        handler(i.value[0]) +
                    ')';

                case 'cos':
                    if (imports.indexOf('import math') === -1)
                        imports.push('import math');
                    
                    return 'math.cos(' +
                        handler(i.value[0]) +
                    ')';

                case 'cosh':
                    if (imports.indexOf('import math') === -1)
                        imports.push('import math');
                    
                    return 'math.cosh(' +
                        handler(i.value[0]) +
                    ')';

                case 'exp':
                    if (imports.indexOf('import math') === -1)
                        imports.push('import math');
                    
                    return 'math.exp(' +
                        handler(i.value[0]) +
                    ')';

                case 'floor':
                    if (imports.indexOf('import math') === -1)
                        imports.push('import math');
                    
                    return 'math.floor(' +
                        handler(i.value[0]) +
                    ')';

                case 'ln':
                    if (imports.indexOf('import math') === -1)
                        imports.push('import math');
                    
                    return 'math.log(' +
                        handler(i.value[0]) +
                    ')';

                case 'log':
                    if (imports.indexOf('import math') === -1)
                        imports.push('import math');
                    
                    return 'math.log10(' +
                        handler(i.value[0]) +
                    ')';

                case 'max': {
                    let args = '';
                    for (let arg of i.value) {
                        args += ',' + handler(arg);
                    }
                    args = args.subtr(1);

                    return 'max(' +
                        args
                    ')';
                }

                case 'min': {
                    let args = '';
                    for (let arg of i.value) {
                        args += ',' + handler(arg);
                    }
                    args = args.subtr(1);

                    return 'min(' +
                        args
                    ')';
                }

                case 'nthRoot':
                    if (imports.indexOf('import math') === -1)
                        imports.push('import math');
                    
                    return handler(i.value[0]) + '**' +
                        '(1 / (' + handler(i.value[1]) + '))';

                case 'rand':
                case 'random': {
                    if (imports.indexOf('import random') === -1)
                        imports.push('import random');
                    
                    if (i.value.length === 0)
                        return 'random.random()';
                    else
                        return 'random.randint(' + handler(i.value[0]) + ',' + handler(i.value[1]) + ')';
                }

                case 'round':
                    return 'round(' +
                        handler(i.value[0]) +
                    ')';

                case 'sgn':
                case 'sign':
                case 'signum':
                    if (imports.indexOf('import math') === -1)
                        imports.push('import math');
                    
                    return 'math.copysign(1,' +
                        handler(i.value[0]) +
                    ')';

                case 'sin':
                    if (imports.indexOf('import math') === -1)
                        imports.push('import math');

                    return 'math.sin(' +
                        handler(i.value[0]) +
                    ')';

                case 'sinh':
                    if (imports.indexOf('import math') === -1)
                        imports.push('import math');
                    
                    return 'math.sinh(' +
                        handler(i.value[0]) +
                    ')';

                case 'sqrt':
                    if (imports.indexOf('import math') === -1)
                        imports.push('import math');
                    
                    return 'math.sqrt(' +
                        handler(i.value[0]) +
                    ')';

                case 'tan':
                    if (imports.indexOf('import math') === -1)
                        imports.push('import math');
                    
                    return 'math.tan(' +
                        handler(i.value[0]) +
                    ')';

                case 'tanh':
                    if (imports.indexOf('import math') === -1)
                        imports.push('import math');
                    
                    return 'math.tanh(' +
                        handler(i.value[0]) +
                    ')';


                default:
                    throw new Error('Unknown function "' + i.name + '"');
            }

        case ConstantNode:
            switch (i.name) {
                case 'e':
                    if (imports.indexOf('import math') === -1)
                        imports.push('import math');
                    
                    return 'math.e';

                case 'pi':
                    if (imports.indexOf('import math') === -1)
                        imports.push('import math');
                    
                    return 'math.pi';


                default:
                    throw new Error('Unknown constant "' + i.name + '"')
            }

        case MultiplicationOperator:
            return handler(i.a) + '*' + handler(i.b);

        case DivisionOperator:
            return handler(i.a) + '/' + handler(i.b);

        case AdditionOperator:
            return handler(i.a) + '+' + handler(i.b);

        case SubtractionOperator:
            return handler(i.a) + '-' + handler(i.b);

        case PowerOperator:
            if (imports.indexOf('import math') === -1)
                imports.push('import math');
                    
            return handler(i.a) + '**' + handler(i.b);

        case ModuloOperator:
            return handler(i.a) + '%' + handler(i.b);


        default:
            throw new Error('Unimplemented NodeType "' + i.constructor + '"');
    }
};

module.exports.handler = run;
