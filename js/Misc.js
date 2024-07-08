const CARDHEIGHT = 989, CARDLENGTH = 690;
let copyrightImg;

let renderCtx;

function rgb2HSL(r, g, b) {
    //Normalize
    r /= 255;
    g /= 255;
    b /= 255;

    // Find greatest and smallest channel values
    let cmin = Math.min(r,g,b),
        cmax = Math.max(r,g,b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;

    // Calculate hue
    // No difference
    if (delta == 0)
        h = 0;
    // Red is max
    else if (cmax == r)
        h = ((g - b) / delta) % 6;
    // Green is max
    else if (cmax == g)
        h = (b - r) / delta + 2;
    // Blue is max
    else
        h = (r - g) / delta + 4;

    h = Math.round(h * 60);
    if (h < 0)
        h += 360;

     // Calculate lightness
    l = (cmax + cmin) / 2;

    // Calculate saturation
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    // Multiply l and s by 100
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return [h, s, l];
}

function hsl2RGB(h, s, l) {
    // Must be fractions of 1
    s /= 100;
    l /= 100;
    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - c/2,
        r = 0,
        g = 0,
        b = 0;

    if (0 <= h && h < 60) {
        r = c; g = x; b = 0;  
    } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
    }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return [r, g, b];
}

class Line {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
}


class Color {
    constructor(r, g, b, a) {
        this.setRGB(r, g, b);
        this.a = a == undefined ? 1 : Math.min(1, Math.max(0, a));
    }

    static fromHex(hex) {
        return new Color(parseInt(hex.substring(1, 3), 16), parseInt(hex.substring(3, 5), 16), parseInt(hex.substring(5, 7), 16), 1);
    }

    get rgbaColorString() {
        return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")";
    }

    get hslaColorString() {
        return "hsla(" + this.h + ", " + this.s + "%, " + this.l + "%, " + this.a + ")";
    }

    setRGB(r, g, b) {
        this.r = Math.min(255, Math.max(0, Math.round(r)));
        this.g = Math.min(255, Math.max(0, Math.round(g)));
        this.b = Math.min(255, Math.max(0, Math.round(b)));
        let hsl = rgb2HSL(this.r, this.g, this.b);
        this.h = hsl[0];
        this.s = hsl[1];
        this.l = hsl[2];
    }

    setHSL(h, s, l) {
        this.h = Math.min(360, Math.max(0, Math.round(h)));
        this.s = Math.min(100, Math.max(0, s));
        this.l = Math.min(100, Math.max(0, l));
        let rgb = hsl2RGB(this.h, this.s, this.l);
        this.r = rgb[0];
        this.g = rgb[1];
        this.b = rgb[2];
    }

    toLuminosity(percent) {
        
        let col = new Color();
        col.setHSL(this.h, this.s, Math.min(100, Math.max(0, percent)));
        return col;
    }

    toSaturation(percent) {
        
        let col = new Color();
        col.setHSL(this.h, Math.min(100, Math.max(0, percent)), this.l);
        return col;
    }
}

class PIEEffect {
    constructor(title, text, color) {
        this.title = title;
        this.text = text;
        this.color = color
    }

    renderEffect() {
        let lineWidth = 4, x = 25 + (lineWidth / 2), y = 609 + (lineWidth / 2), height = 214 - (lineWidth / 2), maxTextWidth = CARDLENGTH - (2 * x) - lineWidth, lineHeight = 40;
        renderLinearGradient(renderCtx, this.color.toSaturation(10), 70, 95, 70, new Line(x, y, CARDLENGTH - x, y), new Line(x, y, CARDLENGTH - 2 * x, height));

        renderCtx.strokeStyle = "black";
        renderCtx.lineWidth = lineWidth;
        renderCtx.strokeRect(x, y, CARDLENGTH - (2 * x), height);

        renderCtx.font = "900 28px arial";
        renderCtx.textAlign = "center";
        renderCtx.fillStyle = "black";
        renderCtx.textBaseline = "top";

        renderTextLines(renderCtx, this.title, 1, maxTextWidth, lineHeight, CARDLENGTH / 2, y + 18);

        renderCtx.font = "27px arial";
        renderTextLines(renderCtx, this.text, 5, maxTextWidth, 30, CARDLENGTH / 2, y + 18 + 35);
    }
}

class renderDescription {

    constructor(text, isCitation, citInfo, color) {
        this.text = text;
        this.isCitation = isCitation;
        this.citInfo = citInfo;
        this.color = color;
    }

    renderDescription() {
        let lineWidth = 4, x = 25 + (lineWidth / 2), y = 830 + (lineWidth / 2), height = 73 - (lineWidth / 2), maxTextWidth = CARDLENGTH - (2 * x) - lineWidth, lineHeight = 40;

        renderLinearGradient(renderCtx, this.color.toSaturation(30), 70, 100, 70, new Line(x, y, CARDLENGTH - x, y), new Line(x, y, CARDLENGTH - 2 * x, height));

        renderCtx.strokeStyle = "black";
        renderCtx.lineWidth = lineWidth;
        renderCtx.strokeRect(x, y, CARDLENGTH - (2 * x), height);

        
        renderCtx.font = "100 italic 20px arial";
        renderCtx.textAlign = "center";
        renderCtx.fillStyle = "black";
        renderCtx.textBaseline = "top";
        let spaceLength = renderCtx.measureText(" ").width;
        let remainingText = renderTextLines(renderCtx, this.text, 1, maxTextWidth, lineHeight, CARDLENGTH / 2, y + 10).join(" ");
        let remLength = renderCtx.measureText(remainingText).width, citLength = renderCtx.measureText(this.citInfo).width;
        renderCtx.fillText(remainingText, CARDLENGTH / 2 - (citLength + spaceLength) / 2, y + lineHeight);
        renderCtx.font = "20px arial";
        renderCtx.fillText(this.citInfo, CARDLENGTH / 2 + (remLength + spaceLength) / 2, y + lineHeight);

    }
}

function renderLinearGradient(ctx, color, lum1, lum2, lum3, gradLine, rectLine) {
    let gradient = ctx.createLinearGradient(gradLine.x1, gradLine.y1, gradLine.x2, gradLine.y2);
    gradient.addColorStop(0.0, color.toLuminosity(lum1).rgbaColorString);
    gradient.addColorStop(0.5, color.toLuminosity(lum2).rgbaColorString);
    gradient.addColorStop(1.0, color.toLuminosity(lum3).rgbaColorString);
    ctx.fillStyle = gradient;
    ctx.fillRect(rectLine.x1, rectLine.y1, rectLine.x2, rectLine.y2);
}

function renderRect(ctx, color, rectLine) {
    ctx.fillStyle = color.rgbaColorString;
    ctx.fillRect(rectLine.x1, rectLine.y1, rectLine.x2, rectLine.y2);
}

function renderTextLines(ctx, text, maxLines, maxTextWidth, lineHeight, x, y) {
    let words = (text === undefined ? "" : text.toString()).split(" ");
    for (let lineNumber = 0; lineNumber < maxLines; lineNumber++) {
        let lineText = "";
        while(words.length > 0 && ctx.measureText(lineText + words[0]).width <= maxTextWidth) {
            lineText = lineText.concat(words.splice(0, 1) + " ");
        }
        ctx.fillText(lineText, x, y + lineNumber * lineHeight);        
    }
    console.log(words);
    return words;
}

function triggerUploadBox() {
    document.getElementById("inputImg").click();
}