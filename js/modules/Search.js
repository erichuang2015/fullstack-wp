class Search {
  // Create Object
  constructor() {
    this.addSearchHTML();
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
        this.typingTimer = setTimeout(this.getResults.bind(this), 750);
      } else {
        this.resultsDiv.html("");
        this.isSpinnerVisible = false;
      }      
    }
    this.previousValue = this.searchField.val();
  }

  getResults() {
    jQuery.when(
      jQuery.getJSON(codeschoolData.root_url +  '/wp-json/wp/v2/posts?search=' + this.searchField.val()), 
      jQuery.getJSON(codeschoolData.root_url +  '/wp-json/wp/v2/pages?search=' + this.searchField.val())
    ).then((posts, pages) => {
      var combinedResults = posts[0].concat(pages[0]);
      this.resultsDiv.html(`
        <h2 class="search-overlay__section-title">General Information</h2>
        ${combinedResults.length ? '<ul class="link-list min-list">' : '<p>No General Information matches that search query.</p>'}
          ${combinedResults.map(result => `<li><a href="${result.link}">${result.title.rendered}</a>${result.type == 'post' ? ` by ${result.authorName}` : '' }</li>`).join('')}
        ${combinedResults.length ? '</ul>' : ''}
      `);
      this.isSpinnerVisible = false;
    }, () => {
      this.resultsDiv.html('<p>Unexpected error, please try again.</p>')
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
    this.searchField.val('');
    setTimeout(() => this.searchField.focus(), 301);
    this.isOverlayOpen = true;
  };

  closeOverlay() {
    this.searchOverlay.removeClass('search-overlay--active');
    jQuery('body').removeClass('body-no-scroll');
    this.isOverlayOpen = false; 
  };

  addSearchHTML() {
    jQuery("body").append(`
      <div class="search-overlay">
        <div class="search-overlay__top">
          <div class="container">
            <i class="fa fa-search search-overlay__icon" aria-hidden="true"></i>
            <input type="text" class="search-term" placeholder="What are you looking for?" id="search-term">
            <i class="fa fa-window-close search-overlay__close" aria-hidden="true"></i>
          </div>
        </div>

        <div class="container">
          <div class="search-overlay__results">
            
          </div>
        </div>
      </div>
    `);
  }
}

var search = new Search();