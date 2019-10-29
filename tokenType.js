export class TokenType {
  constructor(name) {
    this.name = name;
  }
  toString() {
    return `TokenType.${this.name}`;
  }
}

// Single-character tokens.
TokenType.LEFT_PAREN = new TokenType('LEFT_PAREN');
TokenType.RIGHT_PAREN = new TokenType('RIGHT_PAREN');
TokenType.LEFT_BRACE = new TokenType('LEFT_BRACE');
TokenType.RIGHT_BRACE = new TokenType('RIGHT_BRACE');
TokenType.COMMA = new TokenType('COMMA');
TokenType.DOT = new TokenType('DOT');
TokenType.MINUS = new TokenType('MINUS');
TokenType.PLUS = new TokenType('PLUS');
TokenType.SEMICOLON = new TokenType('SEMICOLON');
TokenType.SLASH = new TokenType('SLASH');
TokenType.STAR = new TokenType('STAR');
// One or two character tokens.
TokenType.BANG = new TokenType('BANG');
TokenType.BANG_EQUAL = new TokenType('BANG_EQUAL');
TokenType.EQUAL = new TokenType('EQUAL');
TokenType.EQUAL_EQUAL = new TokenType('EQUAL_EQUAL');
TokenType.GREATER = new TokenType('GREATER');
TokenType.GREATER_EQUAL = new TokenType('GREATER_EQUAL');
TokenType.LESS = new TokenType('LESS');
TokenType.LESS_EQUAL = new TokenType('LESS_EQUAL');
// Literals.
TokenType.IDENTIFIER = new TokenType('IDENTIFIER');
TokenType.STRING = new TokenType('STRING');
TokenType.NUMBER = new TokenType('NUMBER');
// Keywords.
TokenType.AND = new TokenType('AND');
TokenType.CLASS = new TokenType('CLASS');
TokenType.ELSE = new TokenType('ELSE');
TokenType.FALSE = new TokenType('FALSE');
TokenType.FUN = new TokenType('FUN');
TokenType.FOR = new TokenType('FOR');
TokenType.IF = new TokenType('IF');
TokenType.NIL = new TokenType('NIL');
TokenType.OR = new TokenType('OR');
TokenType.PRINT = new TokenType('PRINT');
TokenType.RETURN = new TokenType('RETURN');
TokenType.SUPER = new TokenType('SUPER');
TokenType.THIS = new TokenType('THIS');
TokenType.TRUE = new TokenType('TRUE');
TokenType.VAR = new TokenType('VAR');
TokenType.WHILE = new TokenType('WHILE');
TokenType.LET = new TokenType('LET');
TokenType.IN = new TokenType('IN');
TokenType.EOF = new TokenType('EOF');
