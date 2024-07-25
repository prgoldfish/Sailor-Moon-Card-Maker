class CardImg {
    constructor(img, srcX, srcY, dstX, dstY, width, height) {
        this.img = img;
        this.zoomLevel = 1.0;
        this.optimalZoom = this.zoomLevel;
        this.width = width;
        this.height = height;
        this.changeImg(img);
        this.srcX = srcX;
        this.srcY = srcY;
        this.dstX = dstX;
        this.dstY = dstY;
    }

    renderImg() {
        let boxHeight = this.height/*479*/, boxY = this.dstY/*124*/, lineWidth = 4, boxX = 25 + (lineWidth / 2);

        renderCtx.drawImage(this.img, this.srcX, this.srcY, this.width * this.zoomLevel, this.height * this.zoomLevel, this.dstX, this.dstY, this.width, this.height);

        renderCtx.strokeStyle = "black";
        renderCtx.lineWidth = lineWidth;
        renderCtx.strokeRect(boxX, boxY, CARDLENGTH - (2 * boxX), boxHeight);
    }

    isClickInBox(ev) {
        let rect = ev.target.getBoundingClientRect();
        let x = ev.clientX - rect.left - this.dstX;
        let y = ev.clientY - rect.top - this.dstY;
        return x >= 0 && y >= 0 && x < this.width && y < this.height;
    }

    mouseMoveImg(movX, movY) {
        this.srcX = Math.max(0, Math.min(this.img.naturalWidth - this.width * this.zoomLevel, this.srcX - movX * Math.abs(this.zoomLevel)));
        this.srcY = Math.max(0, Math.min(this.img.naturalHeight - this.height * this.zoomLevel, this.srcY - movY * Math.abs(this.zoomLevel)));
        this.renderImg();
    }
    
    changeImg(newImg) {
        this.img = newImg;
        this.srcX = 0;
        this.srcY = 0;
        let optiZoomX = this.img.naturalWidth / this.width;
        let optiZoomY = this.img.naturalHeight / this.height;
        this.zoomLevel = Math.min(optiZoomX, optiZoomY);
        console.log("optiZoomX : " + optiZoomX + "   optiZoomY : " + optiZoomY);
        this.optimalZoom = this.zoomLevel;
    }

    zoom(ev) {
        this.zoomLevel *= ev.deltaY > 0 ? 1.05 : 0.95;
        if(this.zoomLevel > this.optimalZoom) {
            this.zoomLevel = this.optimalZoom;
        }
        this.mouseMoveImg(0, 0);
    }
}


class BaseCard {
    constructor(borderColor, bgColor, basicRule, img, quote, extNumber, maxExtNumber, copyright) {
        this.borderColor = borderColor;
        this.bgColor = bgColor;
        this.basicRule = basicRule;
        this.img = img;
        this.quote = quote;
        this.extNumber = extNumber;
        this.maxExtNumber = maxExtNumber;
        this.copyright = copyright;
    }

    render() {
        renderLinearGradient(renderCtx, this.borderColor, 20, 50, 80, new Line(0, 0, 0, CARDHEIGHT), new Line(0, 0, CARDLENGTH, CARDHEIGHT));
        renderLinearGradient(renderCtx, this.bgColor, 80, 95, 100, new Line(18, 18, 18, CARDHEIGHT), new Line(18, 18, CARDLENGTH - 36, CARDHEIGHT));
        //renderRect(renderCtx, this.bgColor, new Line(18, 18, CARDLENGTH - 36, CARDHEIGHT));
        renderCtx.drawImage(copyrightImg, (CARDLENGTH - copyrightImg.width) / 2, CARDHEIGHT - copyrightImg.height);
        this.renderExtNumber();
        if(typeof this.basicRule === "string" && this.basicRule.length > 0 ) {
            this.renderBasicRule();
        }
        this.quote.renderQuote();
        this.img.renderImg();
    }

    renderExtNumber() {
        let x = CARDLENGTH - (CARDLENGTH + 36 - copyrightImg.width) / 4;
        renderCtx.font = "bold 20px arial";
        renderCtx.textAlign = "center";
        renderCtx.fillStyle = "black";
        renderCtx.textBaseline = "top";
        renderCtx.fillText(this.extNumber, x, CARDHEIGHT - (3 * 18) + 1);
        renderCtx.fillText(this.maxExtNumber, x, CARDHEIGHT - 19);
        renderCtx.font = "10px arial";
        renderCtx.fillText("OF", x, CARDHEIGHT - 19 - 13);
    }

    renderBasicRule() {
        renderCtx.font = "900 21px arial";
        renderCtx.textAlign = "center";
        renderCtx.fillStyle = "#AC4560";
        renderCtx.fillText("BASIC GAME : " + this.basicRule, CARDLENGTH / 2, CARDHEIGHT - 79);
    }
}

class PIECard extends BaseCard {
    constructor(borderColor, bgColor, basicRule, img, quote, extNumber, maxExtNumber, copyright, name, type, effect) {
        super(borderColor, bgColor, basicRule, img, quote, extNumber, maxExtNumber, copyright);
        this.name = name;
        this.type = type;
        this.effect = effect;

    }

    render() {
        super.render()
        this.effect.renderEffect();
        this.renderType();
        this.renderName();
    }

    renderType() {
        let y = 91;

        renderCtx.font = "900 27px arial";
        renderCtx.textAlign = "center";
        renderCtx.fillStyle = "black";
        renderCtx.textBaseline = "top";
        renderCtx.fontVariantCaps = "small-caps";
        
        renderTextLines(renderCtx, this.type, 1, CARDLENGTH, 0, CARDLENGTH / 2, y);
    }

    renderName() {
        let y = 30;

        renderCtx.font = "64px Roppongi";
        renderCtx.textAlign = "center";
        renderCtx.fillStyle = "black";
        renderCtx.textBaseline = "top";
        renderCtx.fontVariantCaps = "small-caps";
        
        renderTextLines(renderCtx, this.name, 1, CARDLENGTH, 0, CARDLENGTH / 2, y);
    }
}

