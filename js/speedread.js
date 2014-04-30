/**
* @author Saso Nikolov, v1.1 2014
* 
* this class provides an easy way to display a text in an overlay box
* word by word with the provided speed
* It is designed to extend your websites with speed reading capabilities
*/
var SpeedRead = new function() {
	var self = this;
	self.wordPerMinute = 300;
	self.woerter = [];
	self.aktWordCount = 0;
	self.divId = "speadreader_anshownmaske";
	self.contentDiv = null;
	self.readerDiv = null;
	self.pause = false;
	self.stopp = false;
	self.timer = null;

	self._ermittelWoerter = function(text) {
		text = self._removeHTMLTags(text);
		self.woerter = text.split(/\s/);
	}
	self._removeHTMLTags = function(text){
	   text = ""+text;
 	 	text = text.replace(/&(lt|gt);/g, "");
 	 	text = text.replace(/<\/?[^>]+(>|$)/g, "");
 	 	return text;
	}
	self.stop = function() {
    	self.stopp = true;
    	if (self.timer)
    		window.clearTimeout(self.timer);
	}

	self.setContainer = function(contentDiv){
		self.stop();
		if (typeof contentDiv != "object") {
			if (!document.getElementById(contentDiv))
				throw contentDiv+" is not an HTML-Container or an HTML-Container-ID";
			contentDiv = document.getElementById(contentDiv);
		}
		self.contentDiv = contentDiv;
		return self;
	}
	self.setWPM = function(wordPerMinute) {
		self.wordPerMinute = wordPerMinute;
		return self;
	}
	self.setText = function(text){
		self.stop();
		self.contentDiv = null;
		self._ermittelWoerter(text);
		return self;
	}

	self.togglePause = function() {
		self.pause = !self.pause;
		if (!self.pause) {
			if (self.aktWordCount == self.woerter.length)
				self.aktWordCount = 0;
			self.showWoerter();
		}
	}

	self.showReader = function() {
		self.stopp = false;
		if (self.contentDiv)
			self._ermittelWoerter(self.contentDiv.innerHTML);

		var text = '<div style="height:50px;float:left;text-align:left;overflow:visible;font-family:Georgia, Helvetica, Tahoma, Times, Agency;font-size:30px;"></div>'+
				'<form class="form-inline" style="width:170px;float:right;text-align:right;"><div class="form-group"><div class="input-group">'+
				'<div class="input-group-btn"><button type="button" class="btn btn-default" onclick="SpeedRead.togglePause()">'+((self.pause)?'go':'pause')+'</button></div>'+
				'<select class="form-control" style="width:75px;" onchange="SpeedRead.setWPM(this.options[this.selectedIndex].value)">';
		for (var a=250;a<650;a=a+50) {
			text += '<option value='+a+' '+((self.wordPerMinute == a)?"selected":"")+'>'+a+'</option>';
		}
		text += '</select>'+
				'<div class="input-group-btn"><button type="button" class="btn btn-default" onclick="SpeedRead.closeReader()" title="close">X</button></div>'+
				'</div></div></form>'; // anshow im Fenster

		if (self.readerDiv == null) {
			if (!document.getElementById(self.divId)) {
				self.readerDiv = document.createElement("div");
				self.readerDiv.id = self.divId;
				document.getElementsByTagName("body")[0].appendChild(self.readerDiv);
			} else {
				self.readerDiv = document.getElementById(self.divId);
			}
		}

		self.readerDiv.innerHTML = "";
		self.readerDiv.style.width = "80%";           
        self.readerDiv.style.height = "";
        self.readerDiv.style.position = "absolute";
        self.readerDiv.style.zIndex = 101;
		self.readerDiv.style.border = "2px solid #00204e";
        self.readerDiv.style.borderRadius = "6px 6px 6px 6px";
        self.readerDiv.style.boxShadow = "0px 0px 50px 60px #ddd";
        self.readerDiv.style.backgroundColor = "white";
        self.readerDiv.style.backgroundImage = "";
        self.readerDiv.style.top = "10%";
        self.readerDiv.style.left = "8%";
        self.readerDiv.style.overflow = "visible";
        self.readerDiv.style.paddingTop = "15px";
        self.readerDiv.style.paddingBottom = "15px";
        self.readerDiv.style.paddingLeft = "15px";
        self.readerDiv.style.paddingRight = "15px";
        self.readerDiv.innerHTML = text;
        var clientBreite = document.body.clientWidth;        
        self.readerDiv.style.position = 'absolute';
        var toppos = 0;
        if (typeof(document.documentElement.scrollTop) != "undefined") {
            if (typeof(window.pageYOffset) && window.pageYOffset > 0 && window.pageYOffset > document.documentElement.scrollTop) {
                toppos = window.pageYOffset;
            } else {
                if (typeof(document.body.scrollTop) != "undefined" && document.body.scrollTop > document.documentElement.scrollTop) {
                    toppos = document.body.scrollTop;
                } else {
                    toppos = document.documentElement.scrollTop;
                }                
            }       
        } else {
            toppos = window.pageYOffset;
        }
        toppos += 25;    
        self.readerDiv.style.top = toppos+"px";     
        self.readerDiv.style.display = "block";

		return self;
	}
    self.closeReader = function() {
		self.stop();
    	self.aktWordCount = 0;
    	self.pause = false;
        if (self.readerDiv) {
        	self.readerDiv.innerHTML = "";
            self.readerDiv.style.display='none';
            self.readerDiv.style.position='absolute';
        }
        return self;
    }

	self.startReading = function() {
		self.closeReader();
		self.showReader();
		self.showWoerter();
		return self;
	}
	self.showWoerter = function() {
		if (self.stopp)
			return;
		if (self.pause)
			return;
		if (self.aktWordCount >= self.woerter.length)
			return;
		self._showWort(self.aktWordCount);
		self.aktWordCount++;
		var timeout = 1000 / (self.wordPerMinute / 60);
		self.timer = window.setTimeout(self.showWoerter, timeout);
	}
	self._showWort = function(wordCount) {
		var wort = "";
		if (wordCount < self.woerter.length) {
			wort = self.woerter[wordCount];
		}
		self.readerDiv.firstChild.innerHTML = wort;
	}

	return this;
}