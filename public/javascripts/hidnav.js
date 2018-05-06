const adom = document.querySelector("#navall");
const navdom = document.querySelectorAll("nav >a");
adom.addEventListener("click",function(event){
  navdom.forEach(a=>a.classList.toggle("open"));
  // navdom.classList.toggle("open");
})
