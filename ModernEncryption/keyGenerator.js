const fs = require('fs')
const crypto = require('crypto')
const path = require('path')
const validator = require('../lib/validator')

const generateKeys = async (name) => {
  if(!fs.existsSync(path.join(__dirname,'../Core'))) fs.mkdirSync(path.join(__dirname,'../Core'))
  if(name) name = name.trim()
  if(!name){
    console.log('Invalid argument')
    process.exit()
  }
  if(!name.match(/^[a-zA-Z0-9_]*$/)){
    console.log('Emri duhet te permbaje vetem shkronja, numra dhe _')
    process.exit()
  }
  var test = await validator.setPassword(name)
  try{
    if(fs.existsSync(__dirname + '/Keys/'+name+'.pem') || fs.existsSync(__dirname + '/Keys/' + name + '.pub.pem')){
      console.log('Gabim: Celesi ' + name + ' ekziston paraprakisht')
      process.exit()
    }
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase: 'top secret'
      }
    })
    if(fs.existsSync(__dirname + '/Keys/')) makeKey(privateKey,publicKey,name)
    else{
      fs.mkdirSync(__dirname + '/Keys/')
      makeKey(privateKey,publicKey,name)
    }
  }catch(err){
    console.log('There was a problem')
  }
}

const deleteKeys = name => {
  if(!name){
    console.log('Invalid argument')
    process.exit()
  }
  name.trim()
  if(!(fs.existsSync(__dirname + '/Keys/'+name+'.pem') || fs.existsSync(__dirname + '/Keys/' + name + '.pub.pem'))) console.log('Gabim: Celesi \'' + name + '\' nuk ekziston.')
  else{
    if(fs.existsSync(__dirname + '/Keys/'+name+'.pem')) deleteFile(name,'privat')
    if(fs.existsSync(__dirname + '/Keys/' + name + '.pub.pem')) deleteFile(name,'publik')
    deleteUserData(name)
    deleteUserTokens(name)
  }
}

const makeKey = (privateKey,publicKey,name) => {
  fs.writeFile(__dirname + '/Keys/' + name+ '.pem',privateKey,(err)=>{
    if(err) throw err
    console.log('Eshte krijuar celesi privat \'Keys/' + name + '.pem\'')
  })
  fs.writeFile(__dirname + '/Keys/' + name+ '.pub.pem',publicKey,(err)=>{
    if(err) throw err
    console.log('Eshte krijuar celesi publik \'Keys/' + name + '.pub.pem\'')
  })
}

const deleteFile = (name,visibility) => {
  fs.unlink(__dirname + '/Keys/' + name + ((visibility=='privat') ? '.pem' : '.pub.pem'),(err)=>{
    if(err) throw err
    if(!err) {
    console.log(`Eshte larguar celesi ${visibility} keys/${name}`)
    }
  })
}

const deleteUserData = name => {
  if(!fs.existsSync(path.join(__dirname,'../Core/Users/'+name+'.rtf'))){
    console.log('Te dhenat e shfrytezuesit ne fjale nuk u gjenden. Ju lutemi mos fshini te dhena manualisht')
    process.exit(0)
  } 
  fs.unlink(path.join(__dirname,'../Core/Users/'+name+'.rtf'),(err)=>{
    if(err) throw err
    console.log(`Eshte fshire shfrytezuesi ${name}`)
  })
}

const deleteUserTokens = name => {
  //if(!fs.existsSync(path.join(__dirname,'../Core/Token/CoreToken.rtf'))) console.log('do nothing')
  console.log('test1');
  try{
    fs.readFile(path.join(__dirname,'../Core/Token/CoreToken.rtf'),(err,data)=>{
      if(err) throw err
      dataArray = data.toString().split('|')
      dataArray.forEach((element,index)=>{
        if(element==name) dataArray.splice(index-1,2)
      })
      dataArray = dataArray.join('|')
      fs.writeFile(path.join(__dirname,'../Core/Token/CoreToken.rtf'), dataArray, function (err) {
        if (err) { console.log(err.message)}
      })
    })
  }catch(err){
    console.log(err);
  }
  
}

module.exports = {generateKeys,deleteKeys}
