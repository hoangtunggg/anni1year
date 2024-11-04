
let i = 0;
let text1 = "Hé lu bé iu của toai!!!";
let text2 = "Nay là 1 ngày đặc biệt nên ck muốn tặng vk iu 1 mon quà TINH THẦN nho nhỏ" 
let text3 = "Mong là vk iu thích thích nó :> Iu vk nhìu lémmm" 
let speed = 100;

function typeWriter(text, para){
	if(i < text.length){
		document.getElementById(para).innerHTML += text.charAt(i);
		i++;
		speed = Math.random() * 50 + 100;
	}
	else{
		if(ok == 0){
			i = 0;
		}
		ok += 1;
	}
}

setInterval(function(){
	if(ok == 0){
		typeWriter(text1, "txt1");
	}
	else if(ok == 1){
		typeWriter(text2, "txt2");
	}
	else if(ok == 2){
        typeWriter(text3, "txt3");
    }
}, 100)


