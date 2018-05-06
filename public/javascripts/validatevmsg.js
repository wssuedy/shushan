

function validatevmsg(vimg,inputvimg,message){

  let errors = "";
  if(vimg != inputvimg){
    errors = errors || {};
    errors.vimg = "验证码输入有误";
  }
  if(!(message && (message.length < 10 || loginname.length >100))){
    errors = errors || {};
    errors.message = "message length <10 or >100";
  }


  return errors;
}

if(typeof window === 'undefinde'){
  module.exports = validatevmsg;//非window说明是nodejs环境
}
