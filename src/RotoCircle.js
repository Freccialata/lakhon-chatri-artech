class RotoCircle {

    constructor(x, y, xfreq, yfreq, ampl, col, invert) {
        this.x = x;
        this.y = y;
        this.xfreq = xfreq;
        this.yfreq = yfreq;
        this.ampl = ampl;
        this.col = col;
        this.invert = invert;
        this.radius = 120;
        this.history = [];
    }

    update() {
        let xoffset;
        let yoffset;
        if (this.invert) {
            xoffset = sin(-globalArc * this.xfreq) * (600+this.ampl);
            yoffset = cos(-globalArc * this.yfreq) * (300+this.ampl);
        } else {
            xoffset = sin(globalArc * this.xfreq) * (600+this.ampl);
            yoffset = cos(globalArc * this.yfreq) * (300+this.ampl);
        }
        this.x = width/2 + xoffset;
        this.y = height/2 + yoffset;

        let v = createVector(this.x, this.y);

        this.history.push(v);
        //console.log(this.history.length);

        if (this.history.length > 20) {
            this.history.splice(0, 1);
        }
    }

    show() {
        noStroke();
        for (let i = 0; i < this.history.length; i++) {
            let pos = this.history[i];
            let vals = this.col.levels;
            fill(vals[0]-5, vals[1]-5, vals[2]-5, (i/this.history.length)*100);
            ellipse(pos.x, pos.y, this.radius, this.radius);
        }

        fill(this.col);
        ellipse(this.x, this.y, this.radius, this.radius);
    }
}