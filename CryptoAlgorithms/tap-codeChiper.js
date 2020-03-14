module.exports = {
  tencrypt: (plaintext)=>{
    plaintext = plaintext.toUpperCase().trim();
    var getIndex = (c)=>{
      var matrix = [['A','B','C','D','E'],['F','G','H','I','J']
      ,['L','M','N','O','P'],['Q','R','S','T','U']
      ,['V','W','X','Y','Z']];
      var output = [];
      for(var i=0;i<5;i++){
        for(var j=0;j<5;j++){
          if(matrix[i][j]==='K'){
            output.push(1);
            output.push(3);
          }
          if(matrix[i][j]===c){
            output.push(i+1);
            output.push(j+1);
          }
        }
      }
      return output;
    }
    var encrypted_text = '';
    var dot = '.';
   
    for(var i=0;i<plaintext.length;i++){
      if(!plaintext[i].match(/^[A-Za-z\s][A-Za-z\s]*$/)){
        console.log('Only letters allowed!');
        process.exit();
      }
      if(plaintext[i] === ' '){
        encrypted_text += ' ';
      }else{
        var index = (plaintext.charCodeAt(i)-65)/5;
        var a = getIndex(plaintext[i]);
        encrypted_text += dot.repeat(a[0]) + ' ' + dot.repeat(a[1]) + ' ';
      }
    }
    console.log(encrypted_text);
  },
  tdecrypt: (plaintext) =>{
    plaintext = plaintext.trim();
    var decrypted_text ="";
    if(plaintext.match(/[A-Za-z]/)){
      console.log('Invalid syntax');
       process.exit();
   }
    var dotspliter = plaintext.split(/\s+/);
   // console.log(dotspliter);

    var spacespliter = plaintext.split(/\.+/);
   // console.log(spacespliter);
    var matrix = [['A','B','C','D','E'],['F','G','H','I','J']
    ,['L','M','N','O','P'],['Q','R','S','T','U']
    ,['V','W','X','Y','Z']];

    if(dotspliter.length%2 != 0){
       console.log("Missing pair of dot/s!");
        process.exit();
    }
    for(var i=0;i<dotspliter.length;i=i+2){
      var space = "";
      if(spacespliter[i].match(/\s\s+/)){
      var space = " ";
      }

      var t1 = dotspliter[i].length;
      var t2 = dotspliter[i+1].length;
      if(t1>5 || t2>5){
        console.log('Invalid syntax');
        process.exit();
      }
      decrypted_text +=space+matrix[t1-1][t2-1];

    }
    decrypted_text = decrypted_text.toLowerCase();
   // console.log("dotslength:"+dotspliter.length+" spacelegth:"+spacespliter.length);

    console.log(decrypted_text);
  }
}
