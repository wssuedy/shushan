function validateConfig(password,newpassword,confirm,vimg){

  let errors = "";
  if(newpassword && newpassword != confirm){
    errors = errors || {};
    errors.confirm = "新密码两次输入不一致";
  }

  if(!newpassword){
    errors = errors || {};
    errors.newpassword = "新密码为空";
  }

  if(newpassword === password){
    errors = errors || {};
    errors.newpassword = "新密码与原有密码一致";
  }

  if(!vimg){
    errors = errors || {};
    errors.vimg = "验证码为空";
  }

  if(!password){
    errors = errors || {};
    errors.password = "原有密码为空";
  }else if (!(password && /\w{5,12}$/.test(password))) {
    errors = errors || {};
    errors.password = "原有密码格式有问题";
  }

  return errors;
}

// console.log("typeof window"+typeof window);

//
if(typeof window == 'undefined'){
  // console.log("! window");
  module.exports = validateConfig;//非window说明是nodejs环境
}
