class Search {
  // Create Object
  constructor() {
    this.openButton = jQuery('.js-search-trigger');
    this.closeButton = jQuery('.search-overlay__close');
    this.searchOverlay = jQuery('.search-overlay');
    this.events();
  }

  // Events
  events() {
    this.openButton.on('click', this.openOverlay.bind(this));
    this.closeButton.on('click', this.closeOverlay.bind(this));
  }

  // Methods
  openOverlay() {
    this.searchOverlay.addClass('search-overlay--active');
  };

  closeOverlay() {
    this.searchOverlay.removeClass('search-overlay--active');
  };
}

var search = new Search();