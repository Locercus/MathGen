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

let constants = {
    sqrt: undefined
};

class CAS {
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
                    current = new MathNode('TextNode', '');

                if (current.type !== 'TextNode') {
                    newCurrent();
                    current = new MathNode('TextNode', '');
                }

                current.data += ch;
            }
            // Numbers
            else if (eo(co, unicode.numbers)) {
                if (current == null)
                    current = new MathNode('NumberNode', '');

                if (current.type !== 'NumberNode') {
                    newCurrent();
                    current = new MathNode('NumberNode', '');
                }

                current.data += ch;
            }
            // Spaces
            else if (eo(co, unicode.spaces)) {
                newCurrent();
            }
            // Addition
            else if (ch === '+') {
                newCurrent();

                expr.push(new MathNode('AdditionOperator', null));
            }
            // Subtraction
            else if (ch === '-') {
                newCurrent();

                expr.push(new MathNode('SubtractionOperator', null));
            }
            // Multiplication
            else if (ch === '*') {
                newCurrent();

                expr.push(new MathNode('MultiplicationOperator', null));
            }
            // Division
            else if (ch === '/') {
                newCurrent();

                expr.push(new MathNode('DivisionOperator', null));
            }
            // Power
            else if (ch === '^') {
                newCurrent();

                expr.push(new MathNode('PowerOperator', null));
            }
            // Equality
            else if (ch === '=') {
                newCurrent();

                expr.push(new MathNode('ComparisonOperator', 'equal'));
            }
            // Begin Parenthesis
            else if (ch === '(') {
                newCurrent();

                expr.push(new MathNode('BeginParenthesisGroup', null));
            }
            // End Parenthesis
            else if (ch === ')') {
                newCurrent();

                expr.push(new MathNode('EndParenthesisGroup', null));
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

    /*
        cas.p(cas.l('f(2x^2) * sqrt((f(a) + 2) / 4 ) + 3'))
    */

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

        // Handle invisible multiplication
        let groups = groupHandler(lexed);
        for (let i = 0; i < groups.length - 1; i++) {
            let nodes = [
                groups[i],
                groups[i + 1]
            ];

            let multiplication = false;

            if (nodes[0] instanceof MathNode) {
                if (['TextNode', 'NumberNode'].indexOf(nodes[0].type) > -1) {
                    if (nodes[1] instanceof Array) {
                        if (!(nodes[0].data in this.variables || nodes[0].data in constants))
                            multiplication = true;
                    }
                    else if (nodes[1] instanceof MathNode && ['TextNode', 'NumberNode'].indexOf(nodes[1].type) > -1)
                        multiplication = true;
                }
            }
            else if (nodes[0] instanceof Array) {
                if ((nodes[1] instanceof MathNode && nodes[1].type in ['TextNode', 'NumberNode']) || nodes[1] instanceof Array)
                    multiplication = true;
            }

            if (multiplication) {
                groups.splice(i + 1, 0, new MathNode('MultiplicationOperator', null));
                i++;
            }
        }
        
        let expr = null;
        let hierarchy = [
            'ComparisonOperator',

            'PowerOperator',
            'DivisionOperator',
            'MultiplicationOperator',
            'SubtractionOperator',
            'AdditionOperator',

            'NumberNode',
            'TextNode'
        ];
        let scores = [];

        for (let node of groups) {
            if (node instanceof MathNode)
                scores.push(hierarchy.indexOf(node.type));
            else
                scores.push(null);
        }

        console.log(groups, scores);
    }
}

class MathNode {
    constructor(type, data) {
        this.type = type;
        this.data = data;
    }
}

global.CAS = CAS;
