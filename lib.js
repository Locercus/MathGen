#!/usr/bin/env node

'use strict';

let eo = (e, i) => {
    if (i[0] instanceof Array) {
        for (let ie of i) {
            if (ie instanceof Array) {
                if (e >= Math.min.apply(Math, ie) && e <= Math.max.apply(Math, ie))
                    return true;
            }
            else if (typeof ie === 'number') {
                if (e === ie)
                    return true;
            }
        }
        return false;
    }
    else
        return e >= Math.min.apply(Math, i) && e <= Math.max.apply(Math, i);
}

let unicode = {
    letters: [
        [0x0041, 0x005A], // Basic Latin [UPPER]
        [0x0061, 0x007A], // Basic Latin [lower]

        [0x00C0, 0x00D6], // Latin-1 Supplement [1]
        [0x00D8, 0x00F6], // Latin-1 Supplement [2]
        [0x00F8, 0x00FF], // Latin-1 Supplement [3]

        [0x0100, 0x017F], // Latin Extended-A

        [0x0180, 0x024F], // Latin Extended-B

        [0x0250, 0x02AF], // IPA Extensions

        [0x0370, 0x0373], // Greek and Coptic [1]
        [0x0376, 0x0377], // Greek and Coptic [2]
        [0x037B, 0x037D], // Greek and Coptic [3]
        0x037F,           // Greek and Coptic [4]
        0x0386,           // Greek and Coptic [5]
        [0x0388, 0x038A], // Greek and Coptic [6]
        0x038C,           // Greek and Coptic [7]
        [0x038E, 0x03A1], // Greek and Coptic [8]
        [0x03A3, 0x03FF], // Greek and Coptic [9]

        [0x0400, 0x04FF], // Cyrillic

        [0x0500, 0x052F], // Cyrillic Supplement
    ],
    spaces: [
        [0x0000, 0x001F], // C0 Seperators
        0x0020,           // ASCII Space
    ],
    numbers: [0x0030, 0x0039] // Basic Latin
};

let constants = [
    // Constants
    'e',        // e ≈ 2.718          euler's constant
    'pi',       // pi ≈ 3.141         Pi

    // Functions
    'abs',      // abs(-1) = 1        Absolute value
    'acos',
    'acosh',
    'asin',
    'asinh',
    'atan',
    'atanh',
    'cbrt',     // cbrt(9) = 3        Cube root
    'ceil',     // ceil(5.3) = 6      Rounds up to next integer
    'cos',
    'cosh',
    'exp',      // exp(1) = e         Returns e^x
    'floor',    // floor(5.5) = 5     Rounds down to previous integer
    'ln',       // ln(e) = 1          Natural logarithm
    'log',      // log(10) = 1        Base 10 logarithm.
    'max',      // max(1, 2, 3) = 3   Returns the largest value
    'min',      // min(1, 2, 3) = 1   Returns the smallest value
    'nthRoot',  // nthRoot(4, 2) = 2  nth root
    'rand',     //                    Alias of random
    'random',   //                    If no arguments are supplied, returns a random float in the interval [0; 1[. Otherwise expects two parameters as range: [a; b].
    'round',    // round(5.5) = 6     Rounds to nearest integer
    'sgn',      //                    Alias of signum
    'sign',     //                    Alias of signum
    'signum',   // signum(-4.5) = -1  Returns the sign value
    'sin',
    'sinh',
    'sqrt',     // sqrt(4) = 2        Square root
    'tan',
    'tanh',
];

class Parser {
    constructor(variables) {
        if (typeof variables !== 'object')
            variables = {};

        Object.defineProperty(this, 'variables', {
            enumerable: true,
            value: variables
        });
    }

    // Lexer
    l(str) {
        let length = str.length;
        let pos = 0;
        let expr = [];
        let current = null;

        let newCurrent = () => {
            if (current !== null) {
                expr.push(current);
                current = null;   
            }
        }

        while (pos < length) {
            let ch = str.charAt(pos);
            let co = str.charCodeAt(pos);

            // Char identification

            // Letters
            if (eo(co, unicode.letters)) {
                if (current == null)
                    current = new MathLexNode('TextNode', '');

                if (current.type !== 'TextNode') {
                    newCurrent();
                    current = new MathLexNode('TextNode', '');
                }

                current.data += ch;
            }
            // Numbers
            else if (eo(co, unicode.numbers)) {
                if (current == null)
                    current = new MathLexNode('NumberNode', '');

                if (current.type !== 'NumberNode') {
                    newCurrent();
                    current = new MathLexNode('NumberNode', '');
                }

                current.data += ch;
            }
            // Decimal separator (dot)
            else if (ch === '.') {
                if (current == null || current.type !== 'NumberNode' || current.data.indexOf('.') > -1)
                    throw new Error('Unexpected decimal separator at pos ' + pos);

                current.data += '.';
            }
            // Spaces
            else if (eo(co, unicode.spaces)) {
                newCurrent();
            }
            // Addition
            else if (ch === '+') {
                newCurrent();

                expr.push(new MathLexNode('AdditionOperator', null));
            }
            // Subtraction
            else if (ch === '-') {
                newCurrent();

                expr.push(new MathLexNode('SubtractionOperator', null));
            }
            // Multiplication
            else if (ch === '*') {
                newCurrent();

                expr.push(new MathLexNode('MultiplicationOperator', null));
            }
            // Division
            else if (ch === '/') {
                newCurrent();

                expr.push(new MathLexNode('DivisionOperator', null));
            }
            // Power
            else if (ch === '^') {
                newCurrent();

                expr.push(new MathLexNode('PowerOperator', null));
            }
            // Modulo
            else if (ch === '%') {
                newCurrent();

                expr.push(new MathLexNode('ModuloOperator', null));
            }
            // Begin Parenthesis
            else if (ch === '(') {
                newCurrent();

                expr.push(new MathLexNode('BeginParenthesisGroup', null));
            }
            // End Parenthesis
            else if (ch === ')') {
                newCurrent();

                expr.push(new MathLexNode('EndParenthesisGroup', null));
            }
            // Comma
            else if (ch === ',') {
                newCurrent();

                expr.push(new MathLexNode('ParameterSeparator', null));
            }
            // Unknown character
            else
                throw new Error('Unknown character "' + ch + '" at pos ' + pos);

            pos++;
        }

        if (current !== null)
            expr.push(current);

        return expr;
    }

    // Parser
    p(lexed) {
        // Handle groups
        let groupHandler = (group) => {
            let nodePos = 0;
            while (nodePos < group.length) {
                let node = group[nodePos];

                if (node.type === 'EndParenthesisGroup') {
                    let beginIndex = nodePos;

                    while (true) {
                        beginIndex--;

                        if (group[beginIndex].type === 'BeginParenthesisGroup')
                            break;
                    }

                    nodePos -= group.splice(beginIndex, nodePos - beginIndex + 1, groupHandler(group.slice(beginIndex + 1, nodePos))).length;
                }

                nodePos++;
            }

            return group;
        }

        // Handle invisible multiplication/functions
        let groups = groupHandler(lexed);
        let invisMultiplHandler = (groups) => {
            for (let i = 0; i < groups.length - 1; i++) {
                let nodes = [
                    groups[i],
                    groups[i + 1]
                ];

                let multiplication = false;
                let func = false;

                if (nodes[0] instanceof MathLexNode) {
                    if (['TextNode', 'NumberNode'].indexOf(nodes[0].type) > -1) {
                        if (nodes[1] instanceof Array) {
                            invisMultiplHandler(nodes[1]);

                            if (nodes[0].data in this.variables || constants.indexOf(nodes[0].data) > -1)
                                func = true;
                            else
                                multiplication = true;
                        }
                        else if (nodes[1] instanceof MathLexNode && ['TextNode', 'NumberNode'].indexOf(nodes[1].type) > -1)
                            multiplication = true;
                    }
                }
                else if (nodes[0] instanceof Array) {
                    invisMultiplHandler(nodes[0]);

                    if ((nodes[1] instanceof MathLexNode && nodes[1].type in ['TextNode', 'NumberNode']) || nodes[1] instanceof Array)
                        multiplication = true;
                }

                if (multiplication) {
                    groups.splice(i + 1, 0, new MathLexNode('MultiplicationOperator', null));
                    i++;
                }
                else if (func) {
                    groups.splice(i, 1, new MathLexNode('FunctionOperator', nodes[0].data));
                    i++;
                }
            }
        }

        invisMultiplHandler(groups);

        
        let hierarchy = [
            'FunctionOperator',

            'ParameterSeparator',

            'PowerOperator',
            'MultiplicationOperator',
            'DivisionOperator',
            'ModuloOperator',
            'AdditionOperator',
            'SubtractionOperator',
        ];

        let parser = groups => {
            let scores = [];

            if (!(groups instanceof Array))
                groups = [groups];

            for (let node of groups) {
                let score = -1;

                if (node instanceof MathLexNode)
                    score = hierarchy.indexOf(node.type);

                scores.push(score);
            }

            let operatorIndex = scores.indexOf(Math.max.apply(Math, scores));

            let operator = groups[operatorIndex];
            let a = groups.slice(0, operatorIndex);
            let b = groups.slice(operatorIndex + 1, groups.length);

            // Handle unnecessary parantheses
            while (operator instanceof Array && operator.length === 1)
                operator = operator[0];

            while (a instanceof Array && a.length === 1)
                a = a[0];

            while (b instanceof Array && b.length === 1)
                b = b[0];

            if (a == undefined || b == undefined)
                return operator;

            if (operator == undefined)
                return [];

            if (operator.type === 'FunctionOperator') {
                let parameters = [[]];

                for (let param of b) {
                    if (param.type === 'ParameterSeparator') {
                        parameters[parameters.length - 1] = parser(parameters[parameters.length - 1]);
                        parameters.push([]);
                    }
                    else
                        parameters[parameters.length - 1].push(param);

                }

                parameters[parameters.length - 1] = parser(parameters[parameters.length - 1]);

                return new FunctionNode(operator.data, parameters);
            }

            else if (operator.type === 'MultiplicationOperator')
                return new MultiplicationOperator(parser(a), parser(b));

            else if (operator.type === 'DivisionOperator')
                return new DivisionOperator(parser(a), parser(b));

            else if (operator.type === 'AdditionOperator')
                return new AdditionOperator(parser(a), parser(b));

            else if (operator.type === 'SubtractionOperator')
                return new SubtractionOperator(parser(a), parser(b));

            else if (operator.type === 'PowerOperator')
                return new PowerOperator(parser(a), parser(b));

            else if (operator.type === 'TextNode') {
                let variable = new VariableNode(operator.data[0]);
                if (operator.data.length === 1) {
                    if (constants.indexOf(operator.data) > -1)
                        return new ConstantNode(operator.data);
                    else
                        return variable;
                }
                else {
                    if (constants.indexOf(operator.data) > -1)
                        return new ConstantNode(operator.data);
                    else
                        return new MultiplicationOperator(variable, parser([new MathLexNode('TextNode', operator.data.substr(1))]));
                }
            }

            else if (operator.type === 'NumberNode')
                return new NumberNode(operator.data);

            else if (operator.type === 'ModuloOperator')
                return new ModuloOperator(parser(a), parser(b));

            else
                throw new Error('Unimplemented token type "' + operator.type + '"');
        }

        let expr = parser(groups);

        return expr;
    }
}

class MathNode {

}

class VariableNode extends MathNode {
    constructor(name) {
        super();

        this.name = name;
    }
}

class NumberNode extends MathNode {
    constructor(value) {
        super();

        this.value = value;
    }
}

class FunctionNode extends MathNode {
    constructor(name, value) {
        super();

        this.name = name;
        this.value = value;
    }
}

class ConstantNode extends MathNode {
    constructor(name) {
        super();

        this.name = name;
    }
}

class MathOperator extends MathNode {
    constructor(a, b) {
        super();

        this.a = a;
        this.b = b;
    }
}

class MultiplicationOperator extends MathOperator {
    constructor(a, b) {
        super(a, b);
    }
}

class DivisionOperator extends MathOperator {
    constructor(a, b) {
        super(a, b);
    }
}

class AdditionOperator extends MathOperator {
    constructor(a, b) {
        super(a, b);
    }
}

class SubtractionOperator extends MathOperator {
    constructor(a, b) {
        super(a, b);
    }
}

class PowerOperator extends MathOperator {
    constructor(a, b) {
        super(a, b);
    }
}

class ModuloOperator extends MathOperator {
    constructor(a, b) {
        super(a, b);
    }
}

class MathLexNode {
    constructor(type, data) {
        this.type = type;
        this.data = data;
    }
}

global.Parser = Parser;

global.VariableNode           = VariableNode;
global.NumberNode             = NumberNode;
global.FunctionNode           = FunctionNode;
global.ConstantNode           = ConstantNode;
global.MultiplicationOperator = MultiplicationOperator;
global.DivisionOperator       = DivisionOperator;
global.AdditionOperator       = AdditionOperator;
global.SubtractionOperator    = SubtractionOperator;
global.PowerOperator          = PowerOperator;
global.ModuloOperator         = ModuloOperator;
