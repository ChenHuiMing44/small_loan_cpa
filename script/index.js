
HTMLElement.prototype.cpa_on = function(evt, cls , fn){
	this.addEventListener(evt, function(event){
		if(event.target.classList.contains(cls)){
			//使回调函数this指向的是class=focus的元素
			fn.call(event.target, event)
		}
	})
}

