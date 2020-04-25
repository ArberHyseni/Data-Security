const getParamNames = require('./lib/getParametersNames')

function Command(){
  this.line = ''
  this.argumentPassed = false
  this._required = 0
  this._optional = 0
  this.descriptionText = ''
  this.set = (line) => {
    this._setCommand(line)
    this._isrequired()
    return this;
  }
  this.action = (actions) => {
    this._checkActionType(actions)
    this._checkAction(actions)
    for (var i = 0; i < actions.length; i++) {
      //getParamNames(actions)[i] = process.argv[i+2]
    }
    return this;
  }
}

Command.prototype._setCommand = (line) => {
  this.line = line
}

Command.prototype._checkActionType = (actions) => {
  if(typeof actions !== 'function'){
    console.log('You have to send actions as function')
    process.exit()
  }
}

Command.prototype._checkAction = (actions )=> {
  if(actions.length < this._required){
    console.log('Required arguments for commands are not enforced!')
    process.exit()
  }
}

Command.prototype.parse = (argv) => {
  if(typeof argv !== 'object'){
    console.log('TypeError: Invalid syntax at parsing the arguments!')
    process.exit()
  }
  if(process.argv.length !== argv.length){
    console.log('TypeError: Arguments are not parsed! Use command.parse() to parse the arguments.')
    process.exit()
  }
  this.argumentPassed = true
}

Command.prototype.isParsed = () => {
  return this.argumentPassed
}

Command.prototype._isrequired = () => {
  this._required = 0
  this._optional = 0
  for (var i = 0; i < this.line.length; i++) {
    if(this.line.charAt(i)==='<'){
      this._required += 1
    }
    else if(this.line.charAt(i) === '['){
      this._optional += 1
    }
  }
}

Command.prototype.description = (descriptionText) => {
  this.descriptionText = descriptionText
}

Command.prototype.close = () => {
  //console.log(this.line);
  //console.log(this.descriptionText);
  //console.log(this._required);
  //console.log(this._optional);
  //console.log(this.argumentPassed);
  process.exit()
}

//testing
let cmd = new Command()
cmd.parse(process.argv)
cmd.description('This is a test')
cmd.set('caesar <command> <key> [text]').action((a1,a2)=>{
});
cmd.close()

//module.exports = new Command()
