import {Expr, Stmt} from './nodes';
import {AstVisitor} from './astVisitor';

export const pprint = stmtsOrTree => {
  if (stmtsOrTree.length) {
    const stmts = stmtsOrTree;
    const stmtPPrints = [];
    for (let stmt of stmts) {
      stmtPPrints.push(new ASTPrinter().pprintStmt(stmt));
    }
    return `[\n${stmtPPrints.join('\n')}\n]`;
  } else {
    const tree = stmtsOrTree;
    new ASTPrinter().pprintExpr(tree);
  }
}

class ASTPrinter extends Expr.Visitor {
  pprintStmt(stmt) {
    return stmt.accept(this);
  }
  pprintExpr(expr) {
    return expr.accept(this);
  }
  visit_BlockStmt(stmt) {
    return `{${stmt.statements.map(x => x.accept(this)).join('; ')}}`;
  }
  visit_IfStmt(stmt) {
    return `(if ${stmt.condition.accept(this)} then ${stmt.thenBranch.accept(
      this
    )}${stmt.elseBranch ? ` else ${stmt.elseBranch.accept(this)})` : ')'}`;
  }
  visit_WhileStmt(stmt) {
    return `(while ${stmt.condition.accept(this)} do ${stmt.body.accept(
      this
    )})}`;
  }
  visit_ExpressionStmt(stmt) {
    return `${stmt.expression.accept(this)}`;
  }
  visit_ReturnStmt(stmt) {
    if (stmt.value) {
      return `(return ${stmt.value.accept(this)})`;
    } else {
      return 'return';
    }
  }
  visit_PrintStmt(stmt) {
    return `(print ${stmt.expression.accept(this)})`;
  }
  visit_FunctionStmt(stmt) {
    return `(function ${stmt.name.lexeme} (${stmt.params.join(
      ', '
    )}) ${stmt.body.accept(this)})`;
  }
  visit_CallExpr(expr) {
    return `(call ${expr.callee.accept(this)} on ${expr.args
      .map(x => x.accept(this))
      .join(', ')})`;
  }
  visit_VariableExpr(expr) {
    return `(lookup ${expr.name.lexeme})`;
  }
  visit_AssignExpr(expr) {
    return `(${expr.name.lexeme} = ${expr.value.accept(this)})`;
  }
  visit_BinaryExpr(expr) {
    return `(${expr.operator.lexeme} ${expr.left.accept(
      this
    )} ${expr.right.accept(this)})`;
  }
  visit_LogicalExpr(expr) {
    return `(${expr.operator.lexeme} ${expr.left.accept(
      this
    )} ${expr.right.accept(this)})`;
  }
  visit_GroupingExpr(expr) {
    return `(group ${expr.expression.accept(this)})`;
  }
  visit_LiteralExpr(expr) {
    return expr.value === null ? 'nil' : expr.value;
  }
  visit_UnaryExpr(expr) {
    return `({expr.operator.lexeme} {expr.right.accept(this)})`;
  }
  visit_VarStmt(stmt) {
    return `(define ${stmt.name.lexeme} = ${stmt.initializer.accept(this)})`;
  }
}
