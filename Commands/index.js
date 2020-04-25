const error = require('./Errors/errors')

const command = {
  line,
  commands = [],
  commandDescription,
  alias,
  aliasCommand,
  _helpFlag = false,
  _versionFlag = false,
  set: (line) => {
    this.line = line
    commands.push(line.split(" "))
  },
  description: (commandDescription) => {
    this.commandDescription = commandDescription
  },
  setAlias: (aliasCommand,commandsAffected) => {
    this.alias = aliasCommand
    this.aliasCommand = this.line.split(" ")[commandsAffected]
  },
  setAction: (actions[]) => {
    if(this.line.split(/<|>/).length !== actions.length) error.throw('A01')
  },
  parse: (argv) => {
    if(process.argv.length !== argv.length) error.throw('A02')
  }
}

module.exports = command
