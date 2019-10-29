import {scanTokens} from './scanTokens';
import {parse} from './parse';
import {interpret} from './interpret';

const fs = require('fs');


function main() {
  console.log(arguments);
  const args = [...arguments];
  if (args.length > 1) {
    return 'Pass a string to main';
  } else if (args.length == 1) {
    return run(fs.readFileSync(args[0], {encoding: 'utf-8'}));
  } else if (args.length == 0) {
    return 'to run prompt, use input box';
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
