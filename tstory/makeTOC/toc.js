"use strict";

function makeTOC(){
    try{
        const TOC = document.getElementById("TOC");
        if(TOC){
            const secondTitle = document.querySelectorAll("#article-view [data-ke-size]");
            if(!secondTitle) throw Error("h2 코드가 없습니다.");
            secondTitle.forEach((title, arr)=>{
                title.id = `toc_${arr}`;

                if(title.dataset.keSize == "size26"){
                    makeLi("h2", title.textContent, `toc_${arr}`);
                }else if(title.dataset.keSize == "size23"){
                    makeLi("h3", title.textContent, `toc_${arr}`);
                }
            })
        }

        function makeLi(type, content, idName){
            const newLi = document.createElement("li");

            if(type == "h2"){
                newLi.innerHTML = `<a class="toc_style_01" href="#${idName}" target="_self">${content}</a>`;
            }else if(type == "h3"){
                newLi.innerHTML = `<a class="toc_style_02" href="#${idName}" target="_self">${content}</a>`;
            }

            TOC.appendChild(newLi);
        }

    }catch(e){
        console.log(e);
    }
}


window.onload = makeTOC;