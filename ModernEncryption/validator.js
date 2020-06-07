const readline = require("readline")
const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const {abortProcess} = require('./utilities')

const check_onepassword = async ()=>{
    var result = await checkPassword('Jepni fjalekalimin: ','end')
    .then(password=>{
        if(!password.match(/[0-9]/) && !password.match(/[^0-9a-zA-Z]/)) abortProcess('Gabim: Fjalekalimi duhet te permbaje se paku nje numer ose simbol')
        return password
    })
    return result;
}
const validatePassword = async (load = '') => {
    var password
    var result = await checkPassword('Jepni fjalekalimin: ','continue').then(pass=>{
        if(pass.length<6) abortProcess('Fjalekalimi duhet te kete gjatesine se paku 6 karaktere')
        password = pass
        return checkPassword('Perserit fjalekalimin: ','end')
    })
    .then(cpassword=>{
        if(password !== cpassword) abortProcess('Gabim: Fjalekalimet nuk perputhen')
        if(!password.match(/[0-9]/) && !password.match(/[^0-9a-zA-Z]/)) abortProcess('Gabim: Fjalekalimi duhet te permbaje se paku nje numer ose simbol')
        return cpassword
    })
    .catch(error=>{
        console.log('error')
    })
    return result
}

const setPassword = async function(name){
    if(fs.existsSync(path.join(__dirname,'../Core/Users/'+name+'.rtf'))) abortProcess('Shfrytezuesi ekziston paraprakisht')
    const password = await validatePassword()
    const salt = crypto.randomBytes(16).toString('base64')
    const saltedpassword = crypto.createHmac('sha512', salt).update(password).digest('base64')
    const fileText = `${name}|||${salt}.${saltedpassword}\n`;
    
    if(!fs.existsSync(path.join(__dirname,'../Core/Users/'))) fs.mkdirSync(path.join(__dirname,'../Core/Users/'))
    fs.writeFileSync(path.join(__dirname,'../Core/Users/'+name+'.rtf'),fileText,(err)=>{
        if(err) abortProcess(err.message)
    })
    console.log(`Eshte krijuar shfrytezuesi ${name}`)
}

const checkPassword = (question,flag) => {
    let readlineInterface = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
  
    return new Promise(resolve=>{
        readlineInterface.question(question,answer => {
            resolve(answer)
            if(flag == 'end'){
                process.stdin.destroy()
            }
            readlineInterface.close()
        })
    })
}


const Verify_Passwords = async function(name){
    if(!fs.existsSync(path.join(__dirname,'../Core/Users/'+name+'.rtf'))) abortProcess('Shfrytezuesi nuk ekziston!')
    var password = await check_onepassword() // cpassword
	var data  = fs.readFileSync(path.join(__dirname,'../Core/Users/'+name+'.rtf')).toString();
    var spliterline = data.split('|||')
	var spliterpassandpassword = spliterline[1].split('.');
    const salt = spliterpassandpassword[0]
    const saltedpassword = crypto.createHmac('sha512', salt).update(password).digest('base64')
   if(saltedpassword != spliterpassandpassword[1]){
        console.log("Wrong Password");
        process.exit()
   }else{
        return true;
   }
}

module.exports = {setPassword,Verify_Passwords};