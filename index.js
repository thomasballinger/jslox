const readlineSync = require('readline-sync');
const fs = require('fs');

import {TokenType} from './tokenType';
import {scanTokens, LexError} from './scanTokens';
import {parse, parseExpr, ParseError, guessTokensAreExpr} from './parse';
import {interpret, ASTInterpreter, LoxRuntimeError} from './interpret';



function main() {
  console.log(arguments);
  const args = [...arguments];
  console.log(args.length);
  if (args.length > 1) {
    return 'Pass a string to main';
  } else if (args.length == 1) {
    return run(fs.readFileSync(args[0], {encoding: 'utf-8'}));
  } else if (args.length == 0) {
    const interpreter = new ASTInterpreter();
    while (true) {
      runInput(interpreter)
    }
  }
}

// Lex, parse, and run a (possibly multi-line) statement
const runInput = (interpreter) => {
  let opens = 0;
  let closes = 0;
  let tokens = [];

  while (true) {
    const prompt = tokens.length ? '... ' : '>>> ';
    const input = readlineSync.question(prompt);
    let lineTokens;
    try {
      lineTokens = scanTokens(input);
    } catch (e) {
      if (e instanceof LexError) {
        console.log(e);
        tokens = [];
        break;
      } else {
        throw e;
      }
    }
    tokens = [].concat(tokens, lineTokens)

    opens += tokens.filter(x => x.type === TokenType.LEFT_PAREN || x.type === TokenType.LEFT_BRACE).length
    closes += tokens.filter(x => x.type === TokenType.RIGHT_PAREN || x.type === TokenType.RIGHT_BRACE).length

    if (opens <= closes) {
      break
    }
  }

  if (tokens.length < 2) {
    return;
  }

  let parsed;
  try {
    if (guessTokensAreExpr(tokens)) {
      parsed = parseExpr(tokens);
    } else {
      parsed = parse(tokens);
    }
  } catch (e) {
    if (e instanceof ParseError) {
      console.log(e);
      return;
    } else {
      throw e;
    }
  }

  try {
    if (Array.isArray(parsed)) {
      interpreter.interpret(parsed);
    } else {
      console.log(interpreter.stringify(interpreter.evaluate(parsed)));
    }
  } catch (e) {
    if (e instanceof LoxRuntimeError) {
      console.log(e);
      return;
    } else {
      throw e;
    }
  }
}

const run = src => {
  const tokens = scanTokens(src);
  //console.log(tokens);
  const stmts = parse(tokens);
  console.log(stmts);
  return interpret(stmts);
}

if (require.main === module) {
  const [_node, script, ...args] = process.argv
  main(...args);
}
