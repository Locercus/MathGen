#!/usr/bin/env node

'use strict';

function run(i) {
    return handler(i);
}

function handler(i) {
    if (i instanceof Array)
        return '';

    switch (i.constructor) {
        case VariableNode:
            return '$' + i.name;

        case NumberNode:
            return i.value;

        case FunctionNode:
            switch (i.name) {
                case 'abs':
                    return 'abs(' +
                        handler(i.value[0]) +
                    ')';

                case 'acos':
                    return 'acos(' +
                        handler(i.value[0]) +
                    ')';

                case 'acosh':
                    return 'acosh(' +
                        handler(i.value[0]) +
                    ')';

                case 'asin':
                    return 'asin(' +
                        handler(i.value[0]) +
                    ')';

                case 'asinh':
                    return 'asinh(' +
                        handler(i.value[0]) +
                    ')';

                case 'atan':
                    return 'atan(' +
                        handler(i.value[0]) +
                    ')';

                case 'atanh':
                    return 'atanh(' +
                        handler(i.value[0]) +
                    ')';

                case 'cbrt':
                    return 'pow(' +
                        handler(i.value[0]) +
                        '1/3' +
                    ')';

                case 'ceil':
                    return 'ceil(' +
                        handler(i.value[0]) +
                    ')';

                case 'cos':
                    return 'cos(' +
                        handler(i.value[0]) +
                    ')';

                case 'cosh':
                    return 'cosh(' +
                        handler(i.value[0]) +
                    ')';

                case 'exp':
                    return 'exp(' +
                        handler(i.value[0]) +
                    ')';

                case 'floor':
                    return 'floor(' +
                        handler(i.value[0]) +
                    ')';

                case 'ln':
                    return 'log(' +
                        handler(i.value[0]) +
                    ')';

                case 'log':
                    return 'log10(' +
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
                    return 'pow(' +
                        handler(i.value[0]) +
                        '1 / (' + handler(i.value[1]) + ')' +
                    ')';

                case 'rand':
                case 'random': {
                    if (i.value.length === 0)
                        return '(mt_rand() / mt_getrandmax())';
                    else
                        return 'mt_rand(' + handler(i.value[0]) + ',' + handler(i.value[1]) + ')';
                }

                case 'round':
                    return 'round(' +
                        handler(i.value[0]) +
                    ')';

                case 'sgn':
                case 'sign':
                case 'signum':
                    return '(((' + handler(i.value[0]) + ') > 0) ? 1 : (((' + handler(i.value[0]) + ') < 0) ? -1 : 0))';

                case 'sin':
                    return 'sin(' +
                        handler(i.value[0]) +
                    ')';

                case 'sinh':
                    return 'sinh(' +
                        handler(i.value[0]) +
                    ')';

                case 'sqrt':
                    return 'sqrt(' +
                        handler(i.value[0]) +
                    ')';

                case 'tan':
                    return 'tan(' +
                        handler(i.value[0]) +
                    ')';

                case 'tanh':
                    return 'tanh(' +
                        handler(i.value[0]) +
                    ')';


                default:
                    throw new Error('Unknown function "' + i.name + '"');
            }

        case ConstantNode:
            switch (i.name) {
                case 'e':
                    return 'M_E';

                case 'pi':
                    return 'M_PI';


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
            return 'pow(' + handler(i.a) + ',' + handler(i.b) + ')';

        case ModuloOperator:
            return handler(i.a) + '%' + handler(i.b);


        default:
            throw new Error('Unimplemented NodeType "' + i.constructor + '"');
    }
};

module.exports.handler = run;
