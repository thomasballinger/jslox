// GENERATED - DO NOT MANUALLY EDIT!
// To update it, modify tool/generate.js

export class Expr {
  // Call a method on the visitor based on your class name
  accept(visitor) {
    throw Error(`accept method not implemented on ${this.constructor.name}`);
  }
}

{
  class Visitor {
    visit_AssignExpr() {
      throw Error(`visit method "visit_AssignExpr" not implemented on ${this.constructor.name}`);
    }
    visit_BinaryExpr() {
      throw Error(`visit method "visit_BinaryExpr" not implemented on ${this.constructor.name}`);
    }
    visit_CallExpr() {
      throw Error(`visit method "visit_CallExpr" not implemented on ${this.constructor.name}`);
    }
    visit_GroupingExpr() {
      throw Error(`visit method "visit_GroupingExpr" not implemented on ${this.constructor.name}`);
    }
    visit_LiteralExpr() {
      throw Error(`visit method "visit_LiteralExpr" not implemented on ${this.constructor.name}`);
    }
    visit_LogicalExpr() {
      throw Error(`visit method "visit_LogicalExpr" not implemented on ${this.constructor.name}`);
    }
    visit_UnaryExpr() {
      throw Error(`visit method "visit_UnaryExpr" not implemented on ${this.constructor.name}`);
    }
    visit_VariableExpr() {
      throw Error(`visit method "visit_VariableExpr" not implemented on ${this.constructor.name}`);
    }
  }
  Expr.Visitor = Visitor;

  class Assign extends Expr {
    constructor(name, value) {
      super();
      this.name = name;
      this.value = value;
    }
    accept(visitor) {
      return visitor.visit_AssignExpr(this);
    }
  }
  Expr.Assign = Assign;

  class Binary extends Expr {
    constructor(left, operator, right) {
      super();
      this.left = left;
      this.operator = operator;
      this.right = right;
    }
    accept(visitor) {
      return visitor.visit_BinaryExpr(this);
    }
  }
  Expr.Binary = Binary;

  class Call extends Expr {
    constructor(callee, paren, args) {
      super();
      this.callee = callee;
      this.paren = paren;
      this.args = args;
    }
    accept(visitor) {
      return visitor.visit_CallExpr(this);
    }
  }
  Expr.Call = Call;

  class Grouping extends Expr {
    constructor(expression) {
      super();
      this.expression = expression;
    }
    accept(visitor) {
      return visitor.visit_GroupingExpr(this);
    }
  }
  Expr.Grouping = Grouping;

  class Literal extends Expr {
    constructor(value) {
      super();
      this.value = value;
    }
    accept(visitor) {
      return visitor.visit_LiteralExpr(this);
    }
  }
  Expr.Literal = Literal;

  class Logical extends Expr {
    constructor(left, operator, right) {
      super();
      this.left = left;
      this.operator = operator;
      this.right = right;
    }
    accept(visitor) {
      return visitor.visit_LogicalExpr(this);
    }
  }
  Expr.Logical = Logical;

  class Unary extends Expr {
    constructor(operator, right) {
      super();
      this.operator = operator;
      this.right = right;
    }
    accept(visitor) {
      return visitor.visit_UnaryExpr(this);
    }
  }
  Expr.Unary = Unary;

  class Variable extends Expr {
    constructor(name) {
      super();
      this.name = name;
    }
    accept(visitor) {
      return visitor.visit_VariableExpr(this);
    }
  }
  Expr.Variable = Variable;
}



export class Stmt {
  // Call a method on the visitor based on your class name
  accept(visitor) {
    throw Error(`accept method not implemented on ${this.constructor.name}`);
  }
}

{
  class Visitor {
    visit_BlockStmt() {
      throw Error(`visit method "visit_BlockStmt" not implemented on ${this.constructor.name}`);
    }
    visit_ExpressionStmt() {
      throw Error(`visit method "visit_ExpressionStmt" not implemented on ${this.constructor.name}`);
    }
    visit_FunctionStmt() {
      throw Error(`visit method "visit_FunctionStmt" not implemented on ${this.constructor.name}`);
    }
    visit_ForStmt() {
      throw Error(`visit method "visit_ForStmt" not implemented on ${this.constructor.name}`);
    }
    visit_IfStmt() {
      throw Error(`visit method "visit_IfStmt" not implemented on ${this.constructor.name}`);
    }
    visit_ReturnStmt() {
      throw Error(`visit method "visit_ReturnStmt" not implemented on ${this.constructor.name}`);
    }
    visit_PrintStmt() {
      throw Error(`visit method "visit_PrintStmt" not implemented on ${this.constructor.name}`);
    }
    visit_VarStmt() {
      throw Error(`visit method "visit_VarStmt" not implemented on ${this.constructor.name}`);
    }
    visit_WhileStmt() {
      throw Error(`visit method "visit_WhileStmt" not implemented on ${this.constructor.name}`);
    }
  }
  Stmt.Visitor = Visitor;

  class Block extends Stmt {
    constructor(statements) {
      super();
      this.statements = statements;
    }
    accept(visitor) {
      return visitor.visit_BlockStmt(this);
    }
  }
  Stmt.Block = Block;

  class Expression extends Stmt {
    constructor(expression) {
      super();
      this.expression = expression;
    }
    accept(visitor) {
      return visitor.visit_ExpressionStmt(this);
    }
  }
  Stmt.Expression = Expression;

  class Function extends Stmt {
    constructor(name, params, body) {
      super();
      this.name = name;
      this.params = params;
      this.body = body;
    }
    accept(visitor) {
      return visitor.visit_FunctionStmt(this);
    }
  }
  Stmt.Function = Function;

  class For extends Stmt {
    constructor(initializer, condition, increment, body) {
      super();
      this.initializer = initializer;
      this.condition = condition;
      this.increment = increment;
      this.body = body;
    }
    accept(visitor) {
      return visitor.visit_ForStmt(this);
    }
  }
  Stmt.For = For;

  class If extends Stmt {
    constructor(condition, thenBranch, elseBranch) {
      super();
      this.condition = condition;
      this.thenBranch = thenBranch;
      this.elseBranch = elseBranch;
    }
    accept(visitor) {
      return visitor.visit_IfStmt(this);
    }
  }
  Stmt.If = If;

  class Return extends Stmt {
    constructor(keyword, value) {
      super();
      this.keyword = keyword;
      this.value = value;
    }
    accept(visitor) {
      return visitor.visit_ReturnStmt(this);
    }
  }
  Stmt.Return = Return;

  class Print extends Stmt {
    constructor(expression) {
      super();
      this.expression = expression;
    }
    accept(visitor) {
      return visitor.visit_PrintStmt(this);
    }
  }
  Stmt.Print = Print;

  class Var extends Stmt {
    constructor(name, initializer) {
      super();
      this.name = name;
      this.initializer = initializer;
    }
    accept(visitor) {
      return visitor.visit_VarStmt(this);
    }
  }
  Stmt.Var = Var;

  class While extends Stmt {
    constructor(condition, body) {
      super();
      this.condition = condition;
      this.body = body;
    }
    accept(visitor) {
      return visitor.visit_WhileStmt(this);
    }
  }
  Stmt.While = While;
}

