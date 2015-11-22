#!/usr/bin/env node

'use strict';

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
                    return 'Math.abs(' +
                        handler(i.value[0]) +
                    ')';

                case 'acos':
                    return 'Math.acos(' +
                        handler(i.value[0]) +
                    ')';

                case 'acosh':
                    return 'Math.acosh(' +
                        handler(i.value[0]) +
                    ')';

                case 'asin':
                    return 'Math.asin(' +
                        handler(i.value[0]) +
                    ')';

                case 'asinh':
                    return 'Math.asinh(' +
                        handler(i.value[0]) +
                    ')';

                case 'atan':
                    return 'Math.atan(' +
                        handler(i.value[0]) +
                    ')';

                case 'atanh':
                    return 'Math.atanh(' +
                        handler(i.value[0]) +
                    ')';

                case 'cbrt':
                    return 'Math.cbrt(' +
                        handler(i.value[0]) +
                    ')';

                case 'ceil':
                    return 'Math.ceil(' +
                        handler(i.value[0]) +
                    ')';

                case 'cos':
                    return 'Math.cos(' +
                        handler(i.value[0]) +
                    ')';

                case 'cosh':
                    return 'Math.cosh(' +
                        handler(i.value[0]) +
                    ')';

                case 'exp':
                    return 'Math.exp(' +
                        handler(i.value[0]) +
                    ')';

                case 'floor':
                    return 'Math.floor(' +
                        handler(i.value[0]) +
                    ')';

                case 'ln':
                    return 'Math.log(' +
                        handler(i.value[0]) +
                    ')';

                case 'log':
                    return 'Math.log10(' +
                        handler(i.value[0]) +
                    ')';

                case 'max': {
                    let args = '';
                    for (let arg of i.value) {
                        args += ',' + handler(arg);
                    }
                    args = args.subtr(1);

                    return 'Math.max(' +
                        args
                    ')';
                }

                case 'min': {
                    let args = '';
                    for (let arg of i.value) {
                        args += ',' + handler(arg);
                    }
                    args = args.subtr(1);

                    return 'Math.min(' +
                        args
                    ')';
                }

                case 'nthRoot':
                    return 'Math.pow(' +
                        handler(i.value[0]) +
                        '1 / (' + handler(i.value[1]) + ')' +
                    ')';

                case 'rand':
                case 'random': {
                    if (i.value.length === 0)
                        return 'Math.random()';
                    else
                        return '(Math.floor(Math.random() * ((' + handler(i.value[1]) + ')-(' + handler(i.value[0]) + ')+1)) + ' + handler(i.value[0]) + ')';
                }

                case 'round':
                    return 'Math.round(' +
                        handler(i.value[0]) +
                    ')';

                case 'sgn':
                case 'sign':
                case 'signum':
                    return 'Math.sign(' +
                        handler(i.value[0]) +
                    ')';

                case 'sqrt':
                    return 'Math.sqrt(' +
                        handler(i.value[0]) +
                    ')';

                case 'tan':
                    return 'Math.tan(' +
                        handler(i.value[0]) +
                    ')';

                case 'tanh':
                    return 'Math.tanh(' +
                        handler(i.value[0]) +
                    ')';


                default:
                    throw new Error('Unknown function "' + i.name + '"');
            }

        case ConstantNode:
            switch (i.name) {
                case 'e':
                    return 'Math.E';

                case 'pi':
                    return 'Math.PI';


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
            return 'Math.pow(' + handler(i.a) + ',' + handler(i.b) + ')';

        case ModuloOperator:
            return handler(i.a) + '%' + handler(i.b);


        default:
            throw new Error('Unimplemented NodeType "' + i.constructor + '"');
    }
};

module.exports.handler = handler;
