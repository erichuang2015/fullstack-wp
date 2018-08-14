class Search {
  // Create Object
  constructor() {
    this.openButton = jQuery('.js-search-trigger');
    this.closeButton = jQuery('.search-overlay__close');
    this.searchOverlay = jQuery('.search-overlay');
    this.searchField = jQuery('#search-term')
    this.events();
    this.isOverlayOpen = false;
    this.typingTimer;
  }

  // Events
  events() {
    this.openButton.on('click', this.openOverlay.bind(this));
    this.closeButton.on('click', this.closeOverlay.bind(this));
    jQuery(document).on('keydown', this.keyPressDispatcher.bind(this));
    this.searchField.on('keydown', this.typingLogic.bind(this));
  }

  // Methods
  typingLogic() {
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(function() { console.log("2 seconds went by!"); }, 2000);
  }

  keyPressDispatcher(e) {

    if(e.keyCode == 83 && !this.isOverlayOpen) {
      this.openOverlay();
    }

    if(e.keyCode == 27 && this.isOverlayOpen) {
      this.closeOverlay();
    }
  }

  openOverlay() {
    this.searchOverlay.addClass('search-overlay--active');
    jQuery('body').addClass('body-no-scroll');
    this.isOverlayOpen = true;
  };

  closeOverlay() {
    this.searchOverlay.removeClass('search-overlay--active');
    jQuery('body').removeClass('body-no-scroll');
    this.isOverlayOpen = false; 
  };
}

var search = new Search();