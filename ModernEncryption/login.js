const {abortProcess} = require('../lib/utilities.js')
const {setPassword,Verify_Passwords} = require('../lib/validator.js')
const {Verify_This_Token,getTokenfrom} = require('./jwtfunction.js')

const login = async (name) => {
    if(typeof name == 'undefined') abortProcess("Error")
    name = name.trim()
    await Verify_Passwords(name)
    var token = getTokenfrom(name)
    console.log(token)
}

const token_t = async (token) => {
    if(typeof token == 'undefined') abortProcess("Error on token")
    token = token.trim()
    Verify_This_Token(token)
}

module.exports = {login,token_t};


