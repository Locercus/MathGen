# MathGen
A CLI tool for generating programmatical expressions from a mathematical expression

To use MathGen, execute `gen.js`.

Languages currently supported, are: <br/>
`javascript` (ES6+), `php` (4+) and `python` (2.6+).

## Examples
### JavaScript
```
$ echo "sqrt(a^2 + b^2)" | ./gen.js javascript
Math.sqrt(Math.pow(a,2)+Math.pow(b,2))
```

### PHP
```
$ echo "sqrt(a^2 + b^2)" | ./gen.js php
sqrt(pow($a,2)+pow($b,2))
```

### Python
```
$ echo "sqrt(a^2 + b^2)" | ./gen.js python
import math

math.sqrt(math.pow(a,2)+math.pow(b,2))
```

## Features
For a list of supported functions and constants, [see `lib.js:59`](https://github.com/Locercus/MathGen/blob/master/lib.js#L59).
