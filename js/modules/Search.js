class Search {
  // Create Object
  constructor() {
    this.openButton = jQuery('.js-search-trigger');
    this.closeButton = jQuery('.search-overlay__close');
    this.searchOverlay = jQuery('.search-overlay');
    this.events();
    this.isOverlayOpen = false;
  }

  // Events
  events() {
    this.openButton.on('click', this.openOverlay.bind(this));
    this.closeButton.on('click', this.closeOverlay.bind(this));
    jQuery(document).on('keydown', this.keyPressDispatcher.bind(this));
  }

  // Methods
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