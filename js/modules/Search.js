class Search {
  // Create Object
  constructor() {
    this.resultsDiv = jQuery(".search-overlay__results");
    this.openButton = jQuery('.js-search-trigger');
    this.closeButton = jQuery('.search-overlay__close');
    this.searchOverlay = jQuery('.search-overlay');
    this.searchField = jQuery('#search-term')
    this.events();
    this.isOverlayOpen = false;
    this.isSpinnerVisible = false;
    this.previousValue;
    this.typingTimer;
  }

  // Events
  events() {
    this.openButton.on('click', this.openOverlay.bind(this));
    this.closeButton.on('click', this.closeOverlay.bind(this));
    jQuery(document).on('keydown', this.keyPressDispatcher.bind(this));
    this.searchField.on('keyup', this.typingLogic.bind(this));
  }

  // Methods
  typingLogic() {
    if (this.searchField.val() != this.previousValue) {
      clearTimeout(this.typingTimer);

      if (this.searchField.val()) {
        if (!this.isSpinnerVisible) {
          this.resultsDiv.html('<div class="spinner-loader"></div>');
          this.isSpinnerVisible = true;
        }
        this.typingTimer = setTimeout(this.getResults.bind(this), 2000);
      } else {
        this.resultsDiv.html("");
        this.isSpinnerVisible = false;
      }      
    }
    this.previousValue = this.searchField.val();
  }

  getResults() {
    jQuery.getJSON(codeschoolData.root_url +  '/wp-json/wp/v2/posts?search=' + this.searchField.val(), posts => { 
    this.resultsDiv.html(`
        <h2 class="search-overlay__section-title">General Information</h2>
        ${posts.length ? '<ul class="link-list min-list">' : '<p>No General Information matches that search query.</p>'}
          ${posts.map(post => `<li><a href="${post.link}">${post.title.rendered}</a></li>`).join('')}
        ${posts.length ? '</ul>' : ''}
      `);
      this.isSpinnerVisible = false;
    });
    this.isSpinnerVisible = false;
  }

  keyPressDispatcher(e) {

    if(e.keyCode == 83 && !this.isOverlayOpen && !jQuery("input, textarea").is(":focus")) {
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