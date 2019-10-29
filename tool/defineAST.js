const defineClass = (base_class_name, class_name, fields) =>
  `  class ${class_name} extends ${base_class_name} {
    constructor(${fields.join(', ')}) {
      super();
${fields.map(field => `      this.${field} = ${field};`).join('\n')}
    }
    accept(visitor) {
      return visitor.visit_${class_name}${base_class_name}(this);
    }
  }
  ${base_class_name}.${class_name} = ${class_name};`;

export const defineAst = (base_class_name, type_specs) => {
  const classStrings = [];
  const visitor_method_strings = [];
  const classNames = [];
  for (let type_spec of type_specs) {
    const class_name = type_spec.split(':')[0].trim();
    classNames.push(class_name);
    const fields = type_spec
      .split(':')[1]
      .trim()
      .split(', ');
    classStrings.push(defineClass(base_class_name, class_name, fields));
    visitor_method_strings.push(
      `    visit_${class_name}${base_class_name}() {
      throw Error(${'`visit method '}"visit_${class_name}${base_class_name}" not implemented on ${"${this.constructor.name}`"});
    }`
    );
  }

  return `export class ${base_class_name} {
  // Call a method on the visitor based on your class name
  accept(visitor) {
    throw Error(${"`accept method not implemented on ${this.constructor.name}`"});
  }
}

{
  class Visitor {
${visitor_method_strings.join('\n')}
  }
  ${base_class_name}.Visitor = Visitor;

${classStrings.join('\n\n')}
}

`;
};
