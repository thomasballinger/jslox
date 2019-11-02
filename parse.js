import { TokenType } from "./tokenType";
import { Expr, Stmt } from "./nodes";

export const guessTokensAreExpr = tokens => {
  if (
    tokens[tokens.length - 2].type === TokenType.SEMICOLON ||
    tokens[tokens.length - 2].type === TokenType.RIGHT_BRACE
  ) {
    return false;
  }
  return true;
};

// Always returns an array of statements
export const parse = tokens => {
  const p = new Parser(tokens);
  return p.parse();
};

// Always returns a single expression
export const parseExpr = tokens => {
  const p = new Parser(tokens);
  return p.parseExpr();
};

export class ParseError extends Error {
  constructor(token, ...args) {
    super(...args);
    this.token = token;
  }
  toString() {
    return `${this.message} at ${this.token}`;
  }
}

export class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.current = 0;
  }

  parse() {
    const statements = [];
    while (!this.isAtEnd()) {
      statements.push(this.declaration());
    }
    return statements;
  }

  parseExpr() {
    const expr = this.expression();
    if (!this.isAtEnd()) {
      this.error(this.peek(), "could parse rest of tokens");
    }
    return expr;
  }

  declaration() {
    if (this.match(TokenType.FUN)) return this.fun();
    if (this.match(TokenType.VAR)) return this.varDeclaration();
    return this.statement();
  }

  fun(kind) {
    if (kind === undefined) {
      kind = "function";
    }
    const name = this.consume(TokenType.IDENTIFIER, "Expected function name");
    this.consume(TokenType.LEFT_PAREN, `Expected '(' after ${kind} name.`);
    const parameters = [];
    if (!this.check(TokenType.RIGHT_PAREN)) {
      do {
        parameters.push(
          this.consume(TokenType.IDENTIFIER, "Expected parameter name.")
        );
      } while (this.match(TokenType.COMMA));
    }
    this.consume(TokenType.RIGHT_PAREN, "Expected ')' after parameters.");

    this.check(TokenType.LEFT_BRACE, "Expected '{' before ${kind} body");
    const body = this.block();
    return new Stmt.Function(name, parameters, body);
  }

  varDeclaration() {
    const name = this.consume(TokenType.IDENTIFIER, "Expected variable name");

    let init = null;
    if (this.match(TokenType.EQUAL)) {
      init = this.expression();
    }

    this.consume(
      TokenType.SEMICOLON,
      "Expected ';' after variable declaration"
    );
    return new Stmt.Var(name, init);
  }

  statement() {
    if (this.check(TokenType.IF)) return this.ifStatement();
    if (this.check(TokenType.WHILE)) return this.whileStatement();
    if (this.check(TokenType.FOR)) return this.forStatement();
    if (this.check(TokenType.PRINT)) return this.printStatement();
    if (this.check(TokenType.RETURN)) return this.returnStatement();
    if (this.check(TokenType.LEFT_BRACE)) return this.block();
    return this.expressionStatement();
  }

  block() {
    this.consume(
      TokenType.LEFT_BRACE,
      "logic error: blockStatement called when next token was not LEFT_BRACE"
    );
    const statements = [];
    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      statements.push(this.declaration());
    }
    this.consume(TokenType.RIGHT_BRACE);
    return new Stmt.Block(statements);
  }

  printStatement() {
    this.consume(
      TokenType.PRINT,
      "logic error: printStatement called when next token was not PRINT"
    );
    const value = this.expression();
    this.consume(TokenType.SEMICOLON, "Expected ';' after value.");
    return new Stmt.Print(value);
  }

  returnStatement() {
    const keyword = this.consume(
      TokenType.RETURN,
      "logic error: returnStatement called when next token was not RETURN"
    );
    let value = null;
    if (!this.check(TokenType.SEMICOLON)) {
      value = this.expression();
    }
    this.consume(TokenType.SEMICOLON, "Expected ';' after return.");
    return new Stmt.Return(keyword, value);
  }

  ifStatement() {
    this.consume(
      TokenType.IF,
      "logic error: ifStatement called when next token was not IF"
    );
    this.consume(TokenType.LEFT_PAREN, "expected '(' after 'if'");
    const condition = this.expression();
    this.consume(TokenType.RIGHT_PAREN, "expected ')' after 'if'");

    const thenBranch = this.statement();
    let elseBranch;
    if (this.match(TokenType.ELSE)) {
      elseBranch = this.statement();
    }

    return new Stmt.If(condition, thenBranch, elseBranch);
  }

  whileStatement() {
    this.consume(
      TokenType.WHILE,
      "logic error: ifStatement called when next token was not PRINT"
    );
    this.consume(TokenType.LEFT_PAREN, "expected '(' after 'while'");
    const condition = this.expression();
    this.consume(TokenType.RIGHT_PAREN, "expected ')' after 'while'");

    const body = this.statement();

    return new Stmt.While(condition, body);
  }

  forStatement() {
    this.consume(
      TokenType.FOR,
      "logic error: ifStatement called when next token was not PRINT"
    );
    this.consume(TokenType.LEFT_PAREN, "expected '(' after 'while'");
    let initializer;
    if (this.match(TokenType.SEMICOLON)) {
      // no initializer
    } else if (this.match(TokenType.VAR)) {
      initializer = this.varDeclaration();
    } else {
      initializer = this.expressionStatement();
    }

    let condition;
    if (!this.check(TokenType.SEMICOLON)) {
      condition = this.expression();
    } else {
      condition = new Expr.Literal(true);
    }
    this.consume(TokenType.SEMICOLON, "Expected ':' after loop condition.");
    let increment = null;
    if (!this.check(TokenType.RIGHT_PAREN)) {
      increment = this.expression();
    }

    this.consume(TokenType.RIGHT_PAREN, "Expected ')' after for clauses.");
    const body = this.statement();

    return new Stmt.Block(
      [].concat(initializer ? [initializer] : [], [
        new Stmt.While(
          condition,
          new Stmt.Block([].concat([body], increment ? [increment] : []))
        )
      ])
    );
  }

  expressionStatement() {
    const expr = this.expression();
    this.consume(TokenType.SEMICOLON, "Expected ';' after expression.");
    return new Stmt.Expression(expr);
  }

  expression() {
    return this.assignment();
  }

  assignment() {
    const expr = this.or();

    if (this.match(TokenType.EQUAL)) {
      const equals = this.previous();
      const value = this.assignment();

      if (expr instanceof Expr.Variable) {
        return new Expr.Assign(expr.name, value);
      }

      this.error(equals, "Invalid assignment target.");
    }

    return expr;
  }

  or() {
    let expr = this.and();

    while (this.match(TokenType.OR)) {
      const operator = this.previous();
      const right = this.and();
      expr = new Expr.Logical(expr, operator, right);
    }

    return expr;
  }

  and() {
    let expr = this.equality();

    while (this.match(TokenType.AND)) {
      const operator = this.previous();
      const right = this.equality();
      expr = new Expr.Logical(expr, operator, right);
    }

    return expr;
  }

  equality() {
    let expr = this.comparison();

    while (this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
      const operator = this.previous();
      const right = this.comparison();
      expr = new Expr.Binary(expr, operator, right);
    }

    return expr;
  }

  comparison() {
    let expr = this.addition();

    while (
      this.match(
        TokenType.GREATER,
        TokenType.GREATER_EQUAL,
        TokenType.LESS,
        TokenType.LESS_EQUAL
      )
    ) {
      const operator = this.previous();
      const right = this.addition();
      expr = new Expr.Binary(expr, operator, right);
    }

    return expr;
  }

  addition() {
    let expr = this.multiplication();

    while (this.match(TokenType.MINUS, TokenType.PLUS)) {
      const operator = this.previous();
      const right = this.multiplication();
      expr = new Expr.Binary(expr, operator, right);
    }

    return expr;
  }

  multiplication() {
    let expr = this.unary();

    while (this.match(TokenType.SLASH, TokenType.STAR)) {
      const operator = this.previous();
      const right = this.unary();
      expr = new Expr.Binary(expr, operator, right);
    }

    return expr;
  }

  unary() {
    if (this.match(TokenType.BANG, TokenType.MINUS)) {
      const operator = this.previous();
      const right = this.unary();
      return new Expr.Unary(operator, right);
    }

    return this.call();
  }

  call() {
    let expr = this.primary();

    while (true) {
      if (this.match(TokenType.LEFT_PAREN)) {
        expr = this.finishCall(expr);
      } else {
        break;
      }
    }

    return expr;
  }

  finishCall(callee) {
    const args = [];
    if (!this.check(TokenType.RIGHT_PAREN)) {
      do {
        args.push(this.expression());
      } while (this.match(TokenType.COMMA));
    }

    const paren = this.consume(
      TokenType.RIGHT_PAREN,
      "Expected ')' after arguments."
    );

    return new Expr.Call(callee, paren, args);
  }

  primary() {
    if (this.match(TokenType.FALSE)) return new Expr.Literal(false);
    if (this.match(TokenType.TRUE)) return new Expr.Literal(true);
    if (this.match(TokenType.NIL)) return new Expr.Literal(null);

    if (this.match(TokenType.NUMBER, TokenType.STRING)) {
      return new Expr.Literal(this.previous().literal);
    }

    if (this.match(TokenType.IDENTIFIER)) {
      return new Expr.Variable(this.previous());
    }

    if (this.match(TokenType.LEFT_PAREN)) {
      const expr = this.expression();
      this.consume(TokenType.RIGHT_PAREN, "expected ')' after expression.");
      return new Expr.Grouping(expr);
    }

    if (this.match(TokenType.LET)) {
      const variable = this.consume(TokenType.IDENTIFIER);
      this.consume(TokenType.EQUAL);
      const init = this.expression();
      this.consume(TokenType.IN);
      const expr = this.expression();
      console.log(variable, init, expr);
    }

    this.error(this.peek(), "expected expression");
  }

  match(...token_types) {
    for (let token_type of token_types) {
      if (this.check(token_type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  check(token_type) {
    if (this.isAtEnd()) {
      return false;
    }
    return this.peek().type === token_type;
  }

  advance() {
    if (!this.isAtEnd()) {
      this.current += 1;
    }
    return this.previous();
  }

  isAtEnd() {
    return this.peek().type === TokenType.EOF;
  }

  peek() {
    return this.tokens[this.current];
  }

  previous() {
    return this.tokens[this.current - 1];
  }

  consume(token_type, message) {
    if (this.check(token_type)) {
      return this.advance();
    }
    this.error(this.peek(), message);
  }

  error(token, message) {
    throw new ParseError(token, message);
  }
}
