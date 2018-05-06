
  const socket = io.connect();
  const listdom = document.querySelector(".list");


  socket.emit("req","abc",function(res){
    console.log("响应");
  });

  socket.on("newsay",word=>{
    const pdom = document.createElement("p");
    const spandom = document.createElement("span");
    spandom.innerText = word;
    const namedom = document.createElement("span");
    namedom.innerText = "<%=user && user.name ||'游客'%>： "
    pdom.appendChild(namedom);
    pdom.appendChild(spandom);
    listdom.appendChild(pdom);
  })

  function say(event){
    <%if(user && user.name){%>
      socket.emit("say",event.target.value);
    <%}else {%>
      alert("请先登录");
    <%}%>
    // socket.emit("say",event.target.value);
  }

  // socket.on("welcome",data=>{
  //   console.log(data);
  //   socket.emit("question","我想吃 ");
  // });
