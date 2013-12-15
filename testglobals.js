var fs = require('fs');
var esprima = require('esprima');
var escodegen = require('escodegen');
var estraverse = require('estraverse');

function read(file){
  return fs.readFileSync(file, {
    encoding: 'utf-8'
  });
}

function write(code, file){
  return fs.writeFileSync(file, code, {
    encoding: 'utf-8'
  });
}

function parse(code){
  return esprima.parse(code, {
    comment: true
  });
}

function addAfter(list, item, after){
  var idx = list.indexOf(after);
  idx++;
  return list.splice(idx, 0, item);
}

function getIdentifiers(ast){
  var comment = /\s*@testglobals:\s*(.*)/;
  var identifiers = [];
  for(var i = 0; i < ast.comments.length; i++){
    var node = ast.comments[i];
    var found = comment.exec(node.value);
    if(found){
      found[1].split(',').forEach(function(identifier){
        identifiers.push(identifier.trim());
      });
    }
  }
  return identifiers;
}

function addGlobalObject(programNode, name){
  var code = 'Function("return this")().' + name + ' = {}';
  var obj = parse(code);
  return programNode.body.unshift(obj);
}

function createExposer(global, identifier){
  var code = global + '.' + identifier + ' = ' + identifier;
  var parsed = parse(code);
  return parsed.body[0];
}

function expose(global, identifier, list, after){
  var exposer = createExposer(global, identifier);
  return addAfter(list, exposer, after);
}

module.exports = function testglobals(fileIn, fileOut, options){
  if(!options) options = {};
  var global = options.global || '__test__';

  var ast = parse(read(fileIn));
  addGlobalObject(ast, global);

  var identifiers = getIdentifiers(ast);

  estraverse.traverse(ast, {
    enter: function handle(node, parent){
      switch(node.type){

        case 'FunctionDeclaration':
          if(node.id != null && typeof node.id.name !== 'undefined'){
            if(identifiers.indexOf(node.id.name) !== -1){
              expose(global, node.id.name, parent.body, node);
            }
          }
          break;

        case 'VariableDeclaration':
          for(var i = 0; i < node.declarations.length; i++){
            if(node.declarations[i].init){
              if(typeof node.declarations[i].id.name !== 'undefined'){
                if(identifiers.indexOf(node.declarations[i].id.name) !== -1){
                  expose(global, node.declarations[i].id.name, parent.body, node);
                }
              }
            }
          }
          break;

        case 'ExpressionStatement':
          if(node.expression.type === 'AssignmentExpression'){
            if(identifiers.indexOf(node.expression.left.name) !== -1){
              expose(global, node.expression.left.name, parent.body, node);
            }
          }
        break;

      }
    }
  });

  var transformedCode = escodegen.generate(ast);
  write(transformedCode, fileOut);

};