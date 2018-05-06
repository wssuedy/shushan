function validateProduct(title,price,description,vimg){

  let errors = "";


  if(!(title && title.length > 5 && title.length <30)){
    errors = errors || {};
    errors.title = "标题必须输入，长度需在5-30位";
  }


  if(!(price && /\d{1,10}(\.\d{1,2})?$/.test(price))){
    errors = errors || {};
    errors.price = "价格必须输入，需要是整数为10位以内数字，小数为2位数字";
  }

  if(description){
    if(description.length < 5 || description.length >200){
      errors = errors || {};
      errors.description = "描述长度需在5-200位";
    }
  }


  if(!vimg){
    errors = errors || {};
    errors.vimg = "验证码为空";
  }



  return errors;
}

// console.log("typeof window"+typeof window);

//
if(typeof window == 'undefined'){
  // console.log("! window");
  module.exports = validateProduct;//非window说明是nodejs环境
}
