import {defineAst} from './defineAST';
const fs = require('fs');

const exprCode = defineAst("Expr", [
  "Assign   : name, value",
  "Binary   : left, operator, right",
  "Call     : callee, paren, args",
  "Grouping : expression",
  "Literal  : value",
  "Logical  : left, operator, right",
  "Unary    : operator, right",
  "Variable : name"
]);

const stmtCode = defineAst("Stmt", [
  "Block      : statements",
  "Expression : expression",
  "Function   : name, params, body",
  "For        : initializer, condition, increment, body",
  "If         : condition, thenBranch, elseBranch",
  "Return     : keyword, value",
  "Print      : expression",
  "Var        : name, initializer",
  "While      : condition, body"
]);


const warning = `// GENERATED - DO NOT MANUALLY EDIT!
// To update it, modify tool/generate.js

`

const code = warning + [exprCode, stmtCode].join('\n\n')

const filepath = __dirname + '/../nodes.js';

fs.writeFileSync(filepath, code);
