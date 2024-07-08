window.addEventListener("load", () => { // Au chargement de la page
    copyrightImg = document.getElementById("copyrightImg");
    let cnv = document.getElementById("cardRender");
    cnv.height = CARDHEIGHT;
    cnv.width = CARDLENGTH;
    renderCtx = cnv.getContext("2d");
    let colorInputBorder = document.getElementById("colorPickBorder");
    let colorInputBg = document.getElementById("colorPickBackground");
    let inputBasicRule = document.getElementById("inputBasicRule");
    let inputImage = document.getElementById("inputImg");
    let outImg = document.getElementById("uploadedCardImg");
    borderColor = new Color(127, 127, 127, 1);
    bgColor = new Color(127, 127, 127, 1);
    pie = new PIECard();
    pie.borderColor = borderColor;
    pie.bgColor = bgColor;
    pie.basicRule = "Turn 1 Opponent Monster Face Up";
    pie.desc = new renderDescription("\"I am the Guardian of Time! Only those deemed worthy of admittance are allowed here! You are not worthy!\"", true, "Sailor Pluto, Ep. #75", new Color(127, 127, 127, 1));
    pie.effect = new PIEEffect("Time Freeze", "All of your opponents are frozen in time. All of your opponents are frozen in time. All of your opponents are frozen in time. All of your opponents are frozen in time. All of your opponents are frozen in time. All of your opponents are frozen in time.", new Color(127, 127, 127, 1))
    pie.extNumber = 161;
    pie.maxExtNumber = 160;
    pie.type = "Event";
    pie.name = "Sailor Pluto";
    pie.img = new CardImg(outImg, 0, 0, 25, 124, CARDLENGTH - (2 * 25), 479);
    let imgMove = (ev) => pie.img.mouseMoveImg(ev.movementX, ev.movementY);
    colorInputBorder.addEventListener("input", (ev) => {
        
        borderColor = Color.fromHex(ev.target.value);
        //document.body.style.backgroundColor = borderColor.rgbaColorString;
        borderColor = borderColor.toLuminosity(50);
        pie.borderColor = borderColor;
        pie.render();
    });
    colorInputBg.addEventListener("input", (ev) => {
        
        bgColor = Color.fromHex(ev.target.value);
        //document.body.style.backgroundColor = bgColor.rgbaColorString;
        //bgColor = bgColor.toLuminosity(50);
        pie.bgColor = bgColor;
        pie.desc.color = bgColor;
        pie.effect.color = bgColor;
        pie.render();
    });
    inputBasicRule.addEventListener("input", (ev) => {
        
        //pie.basicRule = ev.target.value;
        pie.desc.text = ev.target.value;
        pie.render();
    });
    inputImage.addEventListener("change", (ev) => {
        outImg.onload = function() {
            pie.img.changeImg(outImg);
            pie.render();
        };
        outImg.src = URL.createObjectURL(ev.target.files[0]);
        console.log(ev.target.files[0]);
    });
    cnv.addEventListener("mousedown", (ev) => {
        if(pie.img.isClickInBox(ev)){
            cnv.addEventListener("mousemove", imgMove);
        }
    });
    cnv.addEventListener("mouseup", (ev) => {
        cnv.removeEventListener("mousemove", imgMove);        
    });
    cnv.addEventListener("mouseleave", (ev) => {
        cnv.removeEventListener("mousemove", imgMove);        
    });
    cnv.addEventListener("wheel", (ev) => {
        if(pie.img.isClickInBox(ev)){
            ev.preventDefault();
            ev.stopPropagation();
            pie.img.zoom(ev);
            pie.render();
        }
    });
    document.fonts.load('64px "Roppongi"').then(() => pie.render());
});