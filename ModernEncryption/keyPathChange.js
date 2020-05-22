const path = require('path');
const fs = require('fs');
const os = require('os');
const crypto = require('crypto')

const exportKey = (visibility,name,file) => {
  if(!visibility || !name) abortProcess('Argumentet jovalide')
  if(file) file = file.trim()
  visibility = visibility.trim()
  name = name.trim()
  if((visibility !== 'public' && visibility !== 'private') || !name.match(/^[a-zA-Z0-9_]*$/))
    abortProcess('There is an invalid argument')
  if(typeof file == 'undefined') console.log(readKey(name,visibility))
  if(file){
    if(fs.existsSync(os.homedir() + '/' + file))
      abortProcess('Ekziston nje file tjeter me kete emer ne direktoriumin qe deshironi zhvendosjen e celesit')
    if(file.startsWith('~/'))
      (!fs.existsSync(os.homedir() + '/' + file.substring(2)) ? moveprocess(__dirname + '/Keys/' + name + ((visibility == 'public') ? '.pub.pem' : '.pem'),os.homedir() + '/' + file.substring(2),visibility) : abortProcess('File already exists on that path'))
    if(file.includes(':/'))
      ((!fs.existsSync(file)) ? moveprocess(__dirname + '/Keys/' + name + ((visibility=='private') ? '.pem' : '.pub.pem'), file,visibility) : abortProcess('File already exists on that path'))
    else moveprocess(__dirname + '/Keys/' + name + ((visibility=='public') ? '.pub.pem' : '.pem'),os.homedir() + '/' + file,visibility)
  }
}

const importKey = (name, file) => {
  if(!name || !file) abortProcess('Argumentet jovalide')
  name = name.trim()
  file = file.trim()
  if(file.includes(':/')){
    if(!fs.existsSync(file)) abortProcess('File path is not valid')
    let text = readImportedKey(file)
    if(!text || !text.includes('PUBLIC') || !text.includes('PRIVATE')) abortProcess('Invalid file')
    if(text.includes('PUBLIC')) moveprocess(file,__dirname+'/Keys/' + name + '.pub.pem','public')
    if(text.includes('PRIVATE')){
      moveprocess(file,__dirname+'/Keys/'+name+'.pem','private')
      let privateKey = fs.readFileSync(__dirname + '/Keys/' + name + '.pem');
      var test = crypto.createPrivateKey({'key': privateKey,'passphrase': 'top secret','cipher': 'aes-256-cbc'})
      var test2 = crypto.createPublicKey(test).export({'type':'spki','format': 'pem','cipher': 'aes-256-cbc','passphrase':'top secret'});
      fs.writeFile(__dirname + '/Keys/' + name+ '.pub.pem',test2,(err)=>{
        if(err) throw err;
        console.log('Eshte krijuar celesi publik \'Keys/' + name + '.pub.pem\'')
      })
    }
  }
  if(file.startsWith('~/')){
    if(!fs.existsSync(os.homedir() + file.substr(2))) abortProcess('File path is not valid')
    let text = readImportedKey(os.homedir() + file.substr(2))
    if(!text || !text.includes('PUBLIC') || !text.includes('PRIVATE')) abortProcess('Invalid file')
    if(text.includes('PUBLIC')) moveprocess(os.homedir() + file.substr(2),__dirname+'/Keys/' + name + '.pub.pem','public')
    if(text.includes('PRIVATE')){
      moveprocess(os.homedir() + file.substr(2),__dirname+'/Keys/'+name+'.pem','private')
      let privateKey = fs.readFileSync(__dirname + '/Keys/' + name + '.pem')
      var test = crypto.createPrivateKey({'key': privateKey,'passphrase': 'top secret','cipher': 'aes-256-cbc'})
      var test2 = crypto.createPublicKey(test).export({'type':'spki','format': 'pem','cipher': 'aes-256-cbc','passphrase':'top secret'});
      fs.writeFile(__dirname + '/Keys/' + name+ '.pub.pem',test2,(err)=>{
        if(err) throw err;
        console.log('Eshte krijuar celesi publik \'Keys/' + name + '.pub.pem\'')
      })
    }
  }
  if(fs.existsSync(os.homedir()+'/' + file)){
    let text = readImportedKey(os.homedir()+'/' + file)
    if(!text || !text.includes('PUBLIC') || !text.includes('PRIVATE')) abortProcess('Invalid file')
    if(text.includes('PUBLIC')) moveprocess(os.homedir()+'/' + file,__dirname+'/Keys/'+name+'.pub.pem','public')
    if(text.includes('PRIVATE')){
      moveprocess(os.homedir()+'/'+file,__dirname+'/Keys/'+name+'.pem','private')
      let privateKey = fs.readFileSync(__dirname + '/Keys/' + name + '.pem')
      var test = crypto.createPrivateKey({'key': privateKey,'passphrase': 'top secret','cipher': 'aes-256-cbc'})
      var test2 = crypto.createPublicKey(test).export({'type':'spki','format': 'pem','cipher': 'aes-256-cbc','passphrase':'top secret'});
      fs.writeFile(__dirname + '/Keys/' + name+ '.pub.pem',test2,(err)=>{
        if(err) throw err;
        console.log('Eshte krijuar celesi publik \'Keys/' + name + '.pub.pem\'')
      })
    }
  }
  if(file.startsWith('http' || 'https')){
    //placeholder for fetch
  }
}

const moveprocess = async (oldpath,newpath,visibility) => {
  if(!fs.existsSync(oldpath)) abortProcess('File on that path does not exists')
  if(!fs.existsSync(findDir(newpath))) abortProcess('Destination path does not exists')
  const moveFile = (oldpath,newpath,visibility) =>{
    if(visibility=='public'){
      fs.rename(oldpath, newpath, (err)=>{
        if(err) throw err;
        console.log('Celesi publik u ruajt ne fajllin ' + '.pub.pem');
      })
    }else if(visibility=='private'){
      fs.rename(oldpath, newpath, (err)=>{
        if(err) throw err;
        console.log(`Celesi private u ruajt ne fajllin ${oldpath.split('/').pop()}`);
      })
    }
  }
  const movevar = await moveFile(oldpath,newpath,visibility)
}


const findDir = (pathname) => {
  var fileDir = pathname.split('/')
  fileDir.pop()
  fileDir = fileDir.join('/')
  return fileDir
}

let abortProcess = (statement) => {
  console.log(statement)
  process.exit()
}

let readKey = (name,visibility) => {
  if(!fs.existsSync(__dirname + '/Keys/' + name + ((visibility=='public') ? '.pub.pem' : '.pem'))){
    abortProcess(`Celesi ${name} nuk ekziston`)
  }
  var text = fs.readFileSync(__dirname + '/Keys/' + name + ((visibility=='public') ? '.pub.pem' : '.pem'),(err)=>{
    if(err) abortProcess(`Celesi ${name} nuk ekziston`)
  })
  return text.toString()
}

let readImportedKey = (file) => {
  var text = fs.readFileSync(os.homedir() + '/' + file.substring(2),(err,text)=>{
    if(err) throw err
  })
  return text
}

module.exports = {exportKey,importKey};
