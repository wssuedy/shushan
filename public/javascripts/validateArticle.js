function validateArticle(title,body){

  let errors = "";


  if(!(title && title.length > 3 && title.length <30)){
    errors = errors || {};
    errors.title = "标题必须输入，长度需在4-30位";
  }



  if(body){
    if(body.length < 3 || body.length >200){
      errors = errors || {};
      errors.body = "描述长度需在5-200位";
    }
  }

  return errors;
}

// console.log("typeof window"+typeof window);

//
if(typeof window == 'undefined'){
  // console.log("! window");
  module.exports = validateArticle;//非window说明是nodejs环境
}
