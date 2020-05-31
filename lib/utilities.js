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
    var data = await moveFile(oldpath,newpath,visibility)
}

const findDir = (pathname) => {
    var fileDir = pathname.split('/')
    fileDir.pop()
    fileDir = fileDir.join('/')
    return fileDir
  }

const abortProcess = (statement) => {
    console.log(statement)
    process.exit()
}

module.exports = {moveprocess,findDir,abortProcess}