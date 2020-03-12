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
    var decrypted_text = '';
    var p = plaintext.replace(/\s\s+/g, " ");
    var parray = p.split(' ');
    var counterdots = 0;
    for(var cload=0;cload<parray.length;cload++){
        if(parray[cload].match(/\./)){
           counterdots++;
        }
    }
    //check for format of dots
    if(counterdots%2 != 0){
      console.log("Missing pair of dot/s!");
      process.exit();
    }
	
    var matrix = [['A','B','C','D','E'],['F','G','H','I','J']
                  ,['L','M','N','O','P'],['Q','R','S','T','U']
                  ,['V','W','X','Y','Z']];
				 
    for(var i=0;i<parray.length;i++){
      if(parray[i]==='|'){
        decrypted_text += ' ';
        parray.splice(i,1);
      }
      if(parray[i].length > 5){
        console.log('Invalid syntax');
        process.exit();
      }
      var t1 = parray[i].length;
      var t2 = parray[i+1].length;
      decrypted_text += matrix[t1-1][t2-1];
      i++;
    }
    decrypted_text = decrypted_text.toLowerCase();
    console.log(decrypted_text);
  }
}
