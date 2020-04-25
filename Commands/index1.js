//const error = require('./Errors/errors')

function Command(){
  this.argumentPassed = false
  this._required = 0
  this._optional = 0
  this.commands = []
  this.subcommands = []
  this.aliasCommands = []
  this.aliasAndSubCommands = []
  this.description = ''
}

Command.prototype.parse = (argv) => {
  if(process.argv.length !== argv.length){
    console.log('TypeError: Arguments are not parsed! Use command.parse() to parse the arguments.')
    process.exit()
  }
  this.argumentPassed = true
}

Command.prototype.isParsed = () => {
  return this.argumentPassed
}

Command.prototype.set = (line) => {
  this.line = line
  this.commands.push(this.line.split(' '))
  self._isrequired()
}

Command.prototype._isrequired = () => {
  this.commands.forEach(command => {
    if(command[0]=='<') this._required += 1
    if(command[0]=='[') this._optional += 1
  })
}

Command.prototype.description = (description) => {
  this.description = description
}

Command.prototype.action = (actions) => {
  if(actions.length !== this._required){
    console.log('Required arguments for commands are not enforced!')
    process.exit()
  }
}

Command.prototype.setSubCommand = (subcommand) => {
  this.subcommand = false
  this.commands.forEach(c=> {
    if(c!==subcommand) this.subcommand = false
    else{this.subcommand = true}
  })
  self._validSubCommand()
  subcommands.push(subcommand)
}

Command.prototype._validSubCommand = () => {
  if(typeof this.subcommand == 'undefined'){
    console.log('SubCommand does not match the command in set method!')
    process.exit()
  }
}

Command.prototype.setAlias = (alias) => {
  this.alias = false
  if(typeof self.setSubCommand == 'undefined'){
    console.log('Alias must be associated with setSubCommand! Please set a SubCommand for Alias to work!')
    process.exit()
  }
  if(alias[0] !== '-'){
    console.log('Alias Commands must start with - character!')
    process.exit()
  }
  this.alias = true
  this.aliasCommands.push(alias)
}

Command.prototype._getPair = () => {
  if(aliasCommands.length !== subcommands.length){
    console.log('Pair of alias and subcommands does not match!')
    process.exit()
  }
}

Command.prototype.setCommandsAndAliases = () => {
  for (var i = 0; i < this.subcommands.length; i++) {
    this.aliasAndSubCommands.push((this.aliasCommands[i],this.subcommands[i]))
  }
}

Command.prototype.close = () => {
  self._getPair()
}

let cmd = new Command()
cmd.parse(process.argv)

//caesar <command> <key> [text] = line
//commands = ['caesar','<command>','<key>','[text]']
//_required = 2
//_optional = 1
//<command>
//module.exports = new Command()
