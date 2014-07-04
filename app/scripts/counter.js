"use strict";

////////////////////////////////////////////////////////////
////////////////////////////////////////// FLIP COUNTER CODE
////////////////////////////////////////////////////////////
var flipCounter=function(E,c){var p={value:0,inc:1,pace:1000,auto:true,tFH:39,bFH:64,fW:53,bOffset:390};var G=window.document,h=typeof E!=="undefined"&&E!==""?E:"flip-counter",s=G.getElementById(h);var w={};for(var a in p){w[a]=(a in c)?c[a]:p[a]}var f=[],F=[],C,i,n,l,m=null,j,B,b={q:null,pace:0,inc:0};this.setValue=function(d){if(q(d)){n=w.value;l=d;w.value=d;k(n,l)}return this};this.setIncrement=function(d){w.inc=q(d)?d:p.inc;return this};this.setPace=function(d){w.pace=q(d)?d:p.pace;return this};this.setAuto=function(d){if(d&&!w.auto){w.auto=true;e()}if(!d&&w.auto){if(m){t()}w.auto=false}return this};this.step=function(){if(!w.auto){e()}return this};this.add=function(d){if(q(d)){n=w.value;w.value+=d;l=w.value;k(n,l)}return this};this.subtract=function(d){if(q(d)){n=w.value;w.value-=d;if(w.value>=0){l=w.value}else{l="0";w.value=0}k(n,l)}return this};this.incrementTo=function(y,M,x){if(m){t()}if(typeof M!="undefined"){var H=q(M)?M*1000:10000,d=typeof x!="undefined"&&q(x)?x:w.pace,L=typeof y!="undefined"&&q(y)?y-w.value:0,J,I,o,K=0;b.q=null;d=(H/L>d)?Math.round((H/L)/10)*10:d;J=Math.floor(H/d);I=Math.floor(L/J);o=D(L,J,I,d,H);if(L>0){while(o.result===false&&K<100){d+=10;J=Math.floor(H/d);I=Math.floor(L/J);o=D(L,J,I,d,H);K++}if(K==100){w.inc=b.inc;w.pace=b.pace}else{w.inc=I;w.pace=d}A(y,true,J)}}else{A(y)}};this.getValue=function(){return w.value};this.stop=function(){if(m){t()}return this};function e(){n=w.value;w.value+=w.inc;l=w.value;k(n,l);if(w.auto===true){m=setTimeout(e,w.pace)}}function A(I,d,H){var y=w.value,x=(typeof d=="undefined")?false:d,o=(typeof H=="undefined")?1:H;if(x===true){o--}if(y!=I){n=w.value,w.auto=true;if(y+w.inc<=I&&o!=0){y+=w.inc}else{y=I}w.value=y;l=w.value;k(n,l);m=setTimeout(function(){A(I,x,o)},w.pace)}else{w.auto=false}}function k(o,K){f=u(o);F=u(K);var J,H=f.length,d=F.length;if(d>H){J=d-H;while(J>0){r(d-J+1,F[d-J]);J--}}if(d<H){J=H-d;while(J>0){v(H-J);J--}}for(var I=0;I<H;I++){if(F[I]!=f[I]){g(I,f[I],F[I])}}}function g(y,L,o){var I,H=0,K,J,d=["-"+w.fW+"px -"+(L*w.tFH)+"px",(w.fW*-2)+"px -"+(L*w.tFH)+"px","0 -"+(o*w.tFH)+"px","-"+w.fW+"px -"+(L*w.bFH+w.bOffset)+"px",(w.fW*-2)+"px -"+(o*w.bFH+w.bOffset)+"px",(w.fW*-3)+"px -"+(o*w.bFH+w.bOffset)+"px","0 -"+(o*w.bFH+w.bOffset)+"px"];if(w.auto===true&&w.pace<=300){switch(y){case 0:I=w.pace/6;break;case 1:I=w.pace/5;break;case 2:I=w.pace/4;break;case 3:I=w.pace/3;break;default:I=w.pace/1.5;break}}else{I=80}I=(I>80)?80:I;function x(){if(H<7){K=H<3?"t":"b";J=G.getElementById(h+"_"+K+"_d"+y);if(J){J.style.backgroundPosition=d[H]}H++;if(H!=3){setTimeout(x,I)}else{x()}}}x()}function u(d){return d.toString().split("").reverse()}function r(o,x){var d=Number(o)-1;j=G.createElement("ul");j.className="cd";j.id=h+"_d"+d;j.innerHTML='<li class="t" id="'+h+"_t_d"+d+'"></li><li class="b" id="'+h+"_b_d"+d+'"></li>';if(d%3==0){B=G.createElement("ul");B.className="cd";B.innerHTML='<li class="s"></li>';s.insertBefore(B,s.firstChild)}s.insertBefore(j,s.firstChild);G.getElementById(h+"_t_d"+d).style.backgroundPosition="0 -"+(x*w.tFH)+"px";G.getElementById(h+"_b_d"+d).style.backgroundPosition="0 -"+(x*w.bFH+w.bOffset)+"px"}function v(x){var d=G.getElementById(h+"_d"+x);s.removeChild(d);var o=s.firstChild.firstChild;if((" "+o.className+" ").indexOf(" s ")>-1){d=o.parentNode;s.removeChild(d)}}function z(I){var d=I.toString(),x=d.length,H=1,o;for(o=0;o<x;o++){j=G.createElement("ul");j.className="cd";j.id=h+"_d"+o;j.innerHTML=j.innerHTML='<li class="t" id="'+h+"_t_d"+o+'"></li><li class="b" id="'+h+"_b_d"+o+'"></li>';s.insertBefore(j,s.firstChild);if(H!=(x)&&H%3==0){B=G.createElement("ul");B.className="cd";B.innerHTML='<li class="s"></li>';s.insertBefore(B,s.firstChild)}H++}var y=u(d);for(o=0;o<x;o++){G.getElementById(h+"_t_d"+o).style.backgroundPosition="0 -"+(y[o]*w.tFH)+"px";G.getElementById(h+"_b_d"+o).style.backgroundPosition="0 -"+(y[o]*w.bFH+w.bOffset)+"px"}if(w.auto===true){m=setTimeout(e,w.pace)}}function D(J,I,H,K,y){var o={result:true},x;o.cond1=(J/I>=1)?true:false;o.cond2=(I*H<=J)?true:false;o.cond3=(Math.abs(I*H-J)<=10)?true:false;o.cond4=(Math.abs(I*K-y)<=100)?true:false;o.cond5=(I*K<=y)?true:false;if(o.cond1&&o.cond2&&o.cond4&&o.cond5){x=Math.abs(J-(I*H))+Math.abs(I*K-y);if(b.q===null){b.q=x}if(x<=b.q){b.pace=K;b.inc=H}}for(var d=1;d<=5;d++){if(o["cond"+d]===false){o.result=false}}return o}function q(d){return !isNaN(parseFloat(d))&&isFinite(d)}function t(){clearTimeout(m);m=null}z(w.value)};

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////// MODEL
////////////////////////////////////////////////////////////
var CounterModel = Parse.Object.extend({
	className: "Counter"
});

////////////////////////////////////////////////////////////
///////////////////////////////////////////////// COLLECTION
////////////////////////////////////////////////////////////
var CounterCollection = Parse.Collection.extend({
	model: CounterModel
});

////////////////////////////////////////////////////////////
////////////////////////////////////////////// TOTAL COUNTER
////////////////////////////////////////////////////////////
var numRefreshIntervalMinutes = 1;
var myCounter;
var numCounterIntervalID;

function startCounter() {
	updateCounter();

	numCounterIntervalID = setInterval(function() {
		updateCounter();
	}, numRefreshIntervalMinutes * 60000);
}

function stopCounter() {
	clearInterval(numCounterIntervalID);
}

function updateCounter() {
	var counterCollection = new CounterCollection();
	populateCollection(counterCollection).done(function() {
		var numCounterTotal = counterCollection.models[0].attributes.total;

		if (myCounter) {
			myCounter.setValue(numCounterTotal);
		} else {
			myCounter = new flipCounter('flip-counter', {value: numCounterTotal, auto:false});
		}
	});
}