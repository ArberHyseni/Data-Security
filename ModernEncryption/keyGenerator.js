const fs = require('fs')
const crypto = require('crypto')

const generateKeys = name =>{
  if(name) name = name.trim()
  if(!name.match(/^[a-zA-Z0-9_]*$/)){
    console.log('Emri duhet te permbaje vetem shkronja, numra dhe _')
    process.exit()
  }
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
  if(name) name = name.trim()
  if(!(fs.existsSync(__dirname + '/Keys/'+name+'.pem') || fs.existsSync(__dirname + '/Keys/' + name + '.pub.pem'))) console.log('Gabim: Celesi \'' + name + '\' nuk ekziston.')
  else{
    if(fs.existsSync(__dirname + '/Keys/'+name+'.pem')) deleteFile(name,'privat')
    if(fs.existsSync(__dirname + '/Keys/' + name + '.pub.pem')) deleteFile(name,'publik')
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
  fs.unlink(__dirname + '/Keys/' + name + (visibility=='privat')? '.pem' : '.pub.pem',(err)=>{
    if(!err) {
    console.log(`Eshte larguar celesi ${visibility} keys/${name}`)
    }
  })
}

module.exports = {generateKeys,deleteKeys}
