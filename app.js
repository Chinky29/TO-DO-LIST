let btn=document.querySelector("button");
let ul=document.querySelector("ol");
let input=document.querySelector("input");
btn.addEventListener("click",()=>
{
   
    let item= document.createElement("li");
    item.innerText=input.value;

    let delbtn=document.createElement("button");
    delbtn.innerText="Delete";
    delbtn.classList.add("delete");
    delbtn.classList.add("add");
    item.appendChild(delbtn);
    
    ul.appendChild(item);
    input.value="";

    delbtn.addEventListener("click",()=>{
        let par=delbtn.parentElement;
        par.remove();

    })
})