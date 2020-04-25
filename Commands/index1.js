const getParamNames = require('./lib/getParametersNames')

function Command(){
  this.line = ''
  this.argumentPassed = false
  this._required = 0
  this._optional = 0
  this.commands = []
  this.descriptionText = ''
  this.set = (line) => {
    var self = this
    this._setCommand(line)
    this._isrequired()
    this._seperateCommands(line,self)
    return this;
  }
  this.action = (actions) => {
    var self = this
    this._checkActionType(actions)
    this._checkAction(actions)
    this._actionsCallBack(actions,self)
    return this;
  }
}

Command.prototype._seperateCommands = (line,self) => {
  line = line.split(' ')
  for (var i = 0; i < line.length; i++) {
    if(line[i].includes('<')|| line[i].includes('[')){
      self.commands.push(i)
    }
  }
}

Command.prototype._actionsCallBack = (actions,self) => {
  var args = []
  for (var i = 0; i < getParamNames(actions).length; i++) {
    args.push(process.argv[self.commands[i]+2])
  }
  actions(...args);
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

Command.prototype._checkAction = (actions)=> {
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
  process.exit()
}

//testing
//let cmd = new Command()
//cmd.parse(process.argv)
//cmd.description('This is a test')
//cmd.set('caesar <command> <key> [text]').action((a1,a2,a3,a4)=>{
  //console.log(a1);
  //console.log(a2);
  //console.log(a3);
//});
//cmd.close()

module.exports = new Command()
