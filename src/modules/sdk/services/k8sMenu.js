angular.module('k8s.sdk.services').provider('k8sMenu', function() {
	var sections = {};

	this.addSidebarSection = function(id, title, order, stateDetails) {
	  sections[id] = {
	    id: id,
	    title: title,
	    order: order,
	    stateDetails: stateDetails || null,
	    menuEntries: []
	  };
	  return this.getSidebarSection(id);
	};

	this.getSidebarSection = function(id) {
	  if (sections[id] == null) {
	    throw new Error('section ' + id + ' not defined!')
	  }
	  var section = sections[id];
	  
	  return {
	  	// todo: refactor: use config object {label, state}
	    addMenuEntry: function(label, state) {
	      section.menuEntries.push({
	        label: label,
	        state: state
	      })
	      return this;
	    }
	  }
	};

	this.addManifest = function(component, manifestJson) {
	  for (var i = 0; i < manifestJson.routes.length; i++) {
	    // add routes to menu in a useful way (maybe structure under a main menu point for the component)
	  }
	};

	this.$get = function $get() {
	  return {
	    getSidebarSections: function() {
	      return _.toArray(sections);
	    }
	  };
	};
});