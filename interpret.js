import {AstVisitor} from './astVisitor';

export const interpret = stmts => new ASTInterpreter().interpret(stmts);
export const execute = stmt => new ASTInterpreter().execute(stmt);
export const evaluate = ast => new ASTInterpreter().evaluate(ast);

class LoxRuntimeError extends Error {
  constructor(token, ...args) {
    super(...args);
    this.token = token;
  }
}

class ASTInterpreter extends AstVisitor {
  constructor() {
    super();
    this.env = new Environment();
  }
  interpret(stmts) {
    this.outputs = [];
    for (let stmt of stmts) {
      this.execute(stmt);
    }
    return this.outputs;
  }
  execute(stmt) {
    return stmt.accept(this);
  }
  evaluate(expr) {
    return expr.accept(this);
  }
  executeBlock(stmts, env) {
    const prevEnv = this.env;
    this.env = env;
    try {
      for (let stmt of stmts) {
        this.execute(stmt);
      }
    } finally {
      this.env = prevEnv;
    }
  }
  visit_IfStmt(stmt) {
    if (this.isTruthy(this.evaluate(stmt.condition))) {
      this.execute(stmt.thenBranch);
    } else if (stmt.elseBranch) {
      this.execute(stmt.elseBranch);
    }
  }
  visit_WhileStmt(stmt) {
    while (this.isTruthy(this.evaluate(stmt.condition))) {
      this.execute(stmt.body);
    }
  }
  visit_BlockStmt(stmt) {
    this.executeBlock(stmt.statements, new Environment(this.env));
  }
  visit_VarStmt(stmt) {
    let value = null;
    if (stmt.initializer) {
      value = this.evaluate(stmt.initializer);
    }

    this.env.define(stmt.name.lexeme, value);
  }
  visit_PrintStmt(stmt) {
    const value = this.evaluate(stmt.expression);
    this.outputs.push(this.stringify(value));
  }
  visit_ExpressionStmt(stmt) {
    this.evaluate(stmt.expression);
  }
  visit_AssignExpr(expr) {
    const value = this.evaluate(expr.value);
    this.env.assign(expr.name, value);
    return value;
  }
  visit_VariableExpr(expr) {
    return this.env.get(expr.name);
  }
  visit_LogicalExpr(expr) {
    const left = expr.left.accept(this);

    if (expr.operator.type == TokenType.OR) {
      if (this.isTruthy(left)) return left;
    } else {
      if (!this.isTruthy(left)) return left;
    }

    return this.evaluate(expr.right);
  }
  visit_BinaryExpr(expr) {
    const [left, right] = [this.evaluate(expr.left), this.evaluate(expr.right)];
    switch (expr.operator.type) {
      case TokenType.PLUS:
        if (typeof left === "string" && typeof right === "string") {
          return left + right;
        } else if (typeof left === "number" && typeof right === "number") {
          return left + right;
        } else {
          throw new LoxRuntimeError(
            expr.operator,
            `+ expects two strings or two numbers`
          );
        }
      case TokenType.MINUS:
        return this.assertNumber(left) - this.assertNumber(right);
      case TokenType.SLASH:
        return this.assertNumber(left) / this.assertNumber(right);
      case TokenType.STAR:
        return this.assertNumber(left) * this.assertNumber(right);
      case TokenType.GREATER:
        return this.assertNumber(left) > this.assertNumber(right);
      case TokenType.GREATER_EQUAL:
        return this.assertNumber(left) >= this.assertNumber(right);
      case TokenType.LESS:
        return this.assertNumber(left) < this.assertNumber(right);
      case TokenType.LESS_EQUAL:
        return this.assertNumber(left) <= this.assertNumber(right);
      case TokenType.BANG_EQUAL:
        return !this.isEqual(left, right);
      case TokenType.EQUAL_EQUAL:
        return this.isEqual(left, right);
    }
  }
  visit_GroupingExpr(expr) {
    return this.evaluate(expr.expression);
  }
  visit_LiteralExpr(expr) {
    return expr.value;
  }
  visit_UnaryExpr(expr) {
    const right = this.evaluate(expr.right);
    switch (expr.operator.type) {
      case TokenType.MINUS: {
        return -right;
        break;
      }
      case TokenType.BANG: {
        return !this.isTruthy(right);
      }
      default: {
        throw Error(`Unimplemented unary operator: ${expr.operator.type}`);
      }
    }
  }
  evaluate(expr) {
    return expr.accept(this);
  }
  isTruthy(expr) {
    return !!expr;
  }
  isEqual(e1, e2) {
    return e1 === e2;
  }
  assertNumber(num, token) {
    if (typeof num !== "number") {
      throw new LoxRuntimeError(token, `expected number, not ${num}`);
    }
    return num;
  }
  stringify(value) {
    return '' + value;
  }
}

class Environment {
  constructor(enclosing) {
    this.enclosing = enclosing;
    this.values = new Map();
  }
  get(name) {
    if (this.values.has(name.lexeme)) {
      const val = this.values.get(name.lexeme);
      return val;
    }

    if (this.enclosing) return this.enclosing.get(name);

    throw new LoxRuntimeError(
      name.lexeme,
      `Undefined variable ${name.lexeme})`
    );
  }

  assign(name, value) {
    if (this.values.has(name.lexeme)) {
      this.values.set(name.lexeme, value);
      return;
    }

    if (this.enclosing) return this.enclosing.assign(name, value);

    throw new LoxRuntimeError(
      name.lexeme,
      `Undefined variable ${name.lexeme})`
    );
  }

  define(name, value) {
    this.values.set(name, value);
  }

  toString() {
    return `Env(${this.Map})`;
  }
}
