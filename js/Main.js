function defaultCard() {
    pie = new PIECard();
    pie.borderColor = new Color(127, 127, 127, 1);;
    pie.bgColor = new Color(127, 127, 127, 1);;
    pie.basicRule = "Turn 1 Opponent Monster Face Up";
    pie.quote = new renderQuote("\"I am the Guardian of Time! Only those deemed worthy of admittance are allowed here! You are not worthy!\"", true, "Sailor Pluto, Ep. #75", new Color(127, 127, 127, 1));
    pie.effect = new PIEEffect("Time Freeze", "All of your opponents are frozen in time. Take an extra turn. Discard after use.", new Color(127, 127, 127, 1))
    pie.extNumber = 161;
    pie.maxExtNumber = 160;
    pie.type = "Event";
    pie.name = "Sailor Pluto";
    pie.img = new CardImg(document.getElementById("uploadedCardImg"), 0, 0, 25, 124, CARDLENGTH - (2 * 25), 479);

    return pie;
}

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
    let inputTitre = document.getElementById("inputTitre");
    let dropdownType = document.getElementById("dropdownType");
    let inputDetailledType = document.getElementById("inputDetailledType");
    let inputHP = document.getElementById("inputHP");
    let dropdownPowerType = document.getElementById("dropdownPowerType");
    let inputEffectTitre = document.getElementById("inputEffectTitre");
    let inputEffect = document.getElementById("inputEffect");
    let inputQuote = document.getElementById("inputQuote");
    let inputQuoteContext = document.getElementById("inputQuoteContext");
    let inputExtNumber = document.getElementById("inputExtNumber");
    let inputMaxExtNumber = document.getElementById("inputMaxExtNumber");
    let outImg = document.getElementById("uploadedCardImg");
    borderColor = new Color(127, 127, 127, 1);
    bgColor = new Color(127, 127, 127, 1);
    pie = defaultCard();
    inputBasicRule.value = pie.basicRule;
    inputQuote.value = pie.quote.text;
    inputQuoteContext.value = pie.quote.citInfo;
    inputEffect.value = pie.effect.text;
    inputEffectTitre.value = pie.effect.title;
    inputExtNumber.value = pie.extNumber;
    inputMaxExtNumber.value = pie.maxExtNumber;
    inputTitre.value = pie.name;
    dropdownType.value = pie.type;

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
        pie.quote.color = bgColor;
        pie.effect.color = bgColor;
        pie.render();
    });
    inputBasicRule.addEventListener("input", (ev) => {
        
        pie.basicRule = ev.target.value;
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
    inputTitre.addEventListener("input", (ev) => {
        
        pie.name = ev.target.value;
        pie.render();
    });
    dropdownType.addEventListener("input", (ev) => {
        //TODO: Change card type on event
        pie.type = ev.target.value;
        pie.render();
    });
    inputEffectTitre.addEventListener("input", (ev) => {
        pie.effect.title = ev.target.value;
        pie.render();
    });
    inputEffect.addEventListener("input", (ev) => {
        //TODO: Fix newLines \n
        pie.effect.text = ev.target.value;
        pie.render();
    });
    inputQuote.addEventListener("input", (ev) => {

        pie.quote.text = ev.target.value;
        pie.render();
    });
    inputQuoteContext.addEventListener("input", (ev) => {

        pie.quote.citInfo = ev.target.value;
        pie.quote.isCitation = ev.target.value.toString().trim().length > 0;
        pie.render();
    });
    inputExtNumber.addEventListener("input", (ev) => {

        pie.extNumber = ev.target.value;
        pie.render();
    });
    inputMaxExtNumber.addEventListener("input", (ev) => {

        pie.maxExtNumber = ev.target.value;
        pie.render();
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