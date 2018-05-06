function validate(loginname,password){

  let errors = "";
  if(!(loginname && loginname.length > 2 && loginname.length <20)){
    errors = errors || {};
    errors.name = "用户名长度须为2-20之间";
  }

  if(!(password && /\w{5,12}$/.test(password))){
    errors = errors || {};
    errors.pw = "你的密码格式有问题";
  }

  return errors;
}


if(typeof window === 'undefined'){
  module.exports = validate;//非window说明是nodejs环境
}
