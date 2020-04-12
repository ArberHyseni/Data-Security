const fs = require('fs')
const crypto = require('crypto')

const generateKeys = name =>{
  if(name.match(/^[a-zA-Z0-9_]*$/)){
    try{
      if(fs.existsSync(__dirname + '/Keys/'+name+'.pem') || fs.existsSync(__dirname + '/Keys/' + name + '.pub.pem')){
        console.log('Gabim: Celesi ' + name + ' ekziston paraprakisht');
      }else{
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
        });
        if(fs.existsSync(__dirname + '/Keys/')){
          makeKey(privateKey,publicKey,name)
        }else{
          fs.mkdirSync(__dirname + '/Keys/');
          makeKey(privateKey,publicKey,name)
        }
      }
    }catch(e){
      console.log(e);
    }
  }
  else{
    console.log('Emri duhet te permbaje vetem shkronja, numra dhe _')
    process.exit()
  }
}

const deleteKeys = name => {
  if(fs.existsSync(__dirname + '/Keys/'+name+'.pem') || fs.existsSync(__dirname + '/Keys/' + name + '.pub.pem')){
    fs.unlink(__dirname + '/Keys/' + name + '.pem',(err)=>{
      if(err) throw err;
      console.log('Eshte larguar celesi privat \'keys/' + name + '.pem\'');
    })
    fs.unlink(__dirname + '/Keys/' + name + '.pub.pem',(err)=>{
      if(err) throw err;
      console.log('Eshte larguar celesi publik \'keys/' + name + 'pub.pum');
    })
  }else{
    console.log('Gabim: Celesi \'' + name + '\' nuk ekziston.');
  }
}

const makeKey = (privateKey,publicKey,name) => {
  fs.writeFile(__dirname + '/Keys/' + name+ '.pem',privateKey,(err)=>{
    if(err) throw err;
    console.log('Eshte krijuar celesi privat \'Keys/' + name + '.pem\'')
  })
  fs.writeFile(__dirname + '/Keys/' + name+ '.pub.pem',publicKey,(err)=>{
    if(err) throw err;
    console.log('Eshte krijuar celesi publik \'Keys/' + name + '.pub.pem\'')
  })
}

module.exports = {generateKeys,deleteKeys};
