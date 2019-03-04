var blobs=[];
var numBlobs=25;

function setup() {
  createCanvas(windowWidth, windowHeight);
  for(var i=0; i<numBlobs; i++){
    blobs.push(new Blob(random(width), random(height),7,height/10));
  }
  colorMode(HSB);
  blendMode(NORMAL);
}

function draw() {
  blendMode(NORMAL);
  background(0);
  blendMode(SCREEN);
  blobs.forEach(function(blob){
    blob.show();
    blob.update();
  });
}

function Blob(x,y,n,rBase){
  var hCol=random(360);
  var driftX=random(-1,1);
  var driftY=random(-1,1);
  var a=0;
  var aInc=PI/random(200,500)*(random(10)<5?-1:1);
  var cpReachBase=rBase/2 ;
  var noiseZBase=random(10);
  cpReach=cpReachBase;
  var verts=[];
  var r=rBase+noise(frameCount/100)*rBase*0.1-(rBase*0.05);
  verts.push({i:0, x:r, y:0, a:0, cp0x:r, cp0y:-cpReach, cp1x:r, cp1y:cpReach});
  for(var i=1; i<n; i++){
    var a=i*TWO_PI/n;
    r=rBase+i*10;
    verts.push({
      i:i,
      x: cos(a)*r, 
      y: sin(a)*r, 
      a: a, 
      cp0x: cos(a)*r+cos(a-PI/2)*cpReach,
      cp0y: sin(a)*r+sin(a-PI/2)*cpReach,
      cp1x: cos(a)*r+cos(a+PI/2)*cpReach,
      cp1y: sin(a)*r+sin(a+PI/2)*cpReach
    });
  }
  
  this.update=function(){
    verts=[];
    r=rBase+noise((frameCount/20)/10,noiseZBase)*rBase*3-(rBase);
    cpReach=(r/2)*noise(2+frameCount/100,noiseZBase);
    verts.push({i:0, x:r, y:0, a:0, cp0x:r, cp0y:-cpReach, cp1x:r, cp1y:cpReach});
    for(var i=1; i<n; i++){
      var a=i*TWO_PI/n;
      r=rBase+noise((frameCount/20+i*10)/10,noiseZBase)*rBase*3-(rBase);
      cpReach=(r/4)+(r/4)*noise(2+frameCount/100+i*10,noiseZBase);
      verts.push({
        i:i,
        x: cos(a)*r, 
        y: sin(a)*r, 
        a: a, 
        cp0x: cos(a)*r+cos(a-PI/2)*cpReach,
        cp0y: sin(a)*r+sin(a-PI/2)*cpReach,
        cp1x: cos(a)*r+cos(a+PI/2)*cpReach,
        cp1y: sin(a)*r+sin(a+PI/2)*cpReach
      });
    }
    drift();
  };
  
  function drift(){
    a=(a+aInc)%360;
    x+=driftX;
    y+=driftY;
    if(x>width+r*2) x=-r*2;
    if(x<-r*2) x=width+r*2;
    if(y>height+r*2) y=-r*2;
    if(y<-r*2) y=height+r*2;
  }
  
  this.show=function(){
    push();
    translate(x,y);
    rotate(a);
    beginShape();
    vertex(verts[0].x, verts[0].y);
    for(var i=1; i<verts.length; i++){
      bezierVertex(verts[i-1].cp1x, verts[i-1].cp1y, verts[i].cp0x, verts[i].cp0y,verts[i].x, verts[i].y);
    }
    bezierVertex(verts[verts.length-1].cp1x, verts[verts.length-1].cp1y, verts[0].cp0x, verts[0].cp0y,verts[0].x, verts[0].y);
    fill(hCol,90,90,0.5);
    noStroke();
    endShape();
    pop();
  }
}