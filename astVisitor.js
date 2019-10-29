import {Expr, Stmt} from './nodes';

// AstVisitor "inherits" from both Expr.Visitor and Stmt.Visitor
export class AstVisitor {}

const methodsToAdd = {};
for (let visitorClass of [Expr.Visitor, Stmt.Visitor]) {
  Object.getOwnPropertyNames(visitorClass.prototype).map(name => {
    methodsToAdd[name] = visitorClass.prototype[name];
  });
}

Object.assign(AstVisitor.prototype, methodsToAdd);
