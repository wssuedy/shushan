
  const buttondom = document.querySelector("#chatbutton");
  const closedom = document.querySelector("#closebutton");
  const iframedom = document.querySelector("#chatbox");
  buttondom.addEventListener("click",function(event){
    iframedom.className="openbox";
    console.log(iframedom.className);
    buttondom.style.display = "none";
    closedom.style.display = "block";
  })

  closedom.addEventListener("click",function(event){
    iframedom.className="hiddenbox";
    console.log(iframedom.className);
    buttondom.style.display = "block";
    closedom.style.display = "none";

  })
