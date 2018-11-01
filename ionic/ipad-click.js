	/**
 * DOM utility functions
 */
	var _ = {
	  $: function (id) {
	    return document.getElementById(id);
	  },

	  all: function (selectors) {
	    return document.querySelectorAll(selectors);
	  },

	  show: function (id) {
	    var target = document.getElementById(id);
	    target.style.display = "block";
	  },

	  hide: function (id) {
	    var target = document.getElementById(id);
	    target.style.display = "none";
	  },

	  toggle: function (selectors, cssClass) {
	    var cssClass = cssClass || "hidden";
	    var nodes = document.querySelectorAll(selectors);
	    var l = nodes.length;
	    for ( i = 0 ; i < l; i++ ) {
	      var el = nodes[i];
	      //el.style.display = (el.style.display != 'none' ? 'none' : '' );
	      // Bootstrap compatibility
	      if (-1 !== el.className.indexOf(cssClass)) {
	        el.className = el.className.replace(cssClass, '');
	      } else {
	        el.className += ' ' + cssClass;
	      }
	    }
	  }
	};

	function handleCheckbox(e){
		var target = _.$(e);
		if(target.getAttribute("checked")){
			target.removeAttribute("checked");
		} else {
			target.setAttribute("checked", "checked");
		}
	}

	function introToTerms(){
		_.hide("title-div");
		_.show("terms-div");
	}

	function termsToCamera(){
		var target = _.$('terms-check');
		console.log(target.getAttribute("checked"));
		if(target.getAttribute("checked") == "checked"){
			_.hide("terms-div");
			_.show("photo-div");
		}

	}

	function photoToInstruction(){
		_.hide("photo-div");
		_.show("instruction-div");
	}