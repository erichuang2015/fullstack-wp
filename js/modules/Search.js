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
    jQuery.getJSON(codeschoolData.root_url + '/wp-json/codeschool/v1/search?term=' + this.searchField.val(), (results) => {
      this.resultsDiv.html(`
        <div class="row">
          <div class="one-third">
            <h2 class="search-overlay__section-title">General Information</h2>
            ${results.generalInfo.length ? '<ul class="link-list min-list">' : '<p>No general information matches that search query.</p>'}
              ${results.generalInfo.map(result => `<li><a href="${result.permalink}">${result.title}</a>${result.postType == 'post' ? ` by ${result.authorName}` : '' }</li>`).join('')}
            ${results.generalInfo.length ? '</ul>' : ''}
          </div>
          <div class="one-third">
            <h2 class="search-overlay__section-title">Programs</h2>
            ${results.programs.length ? '<ul class="link-list min-list">' : `<p>No programs match that search query. <a href="${codeschoolData.root_url}/programs">View all programs.</a></p>`}
              ${results.programs.map(result => `<li><a href="${result.permalink}">${result.title}</a></li>`).join('')}
            ${results.programs.length ? '</ul>' : ''}

            <h2 class="search-overlay__section-title">Professors</h2>
            ${results.professors.length ? '<ul class="professor-cards">' : `<p>No professors match that search query.</p>`}
              ${results.professors.map(result => `
                <li class="professor-card__list-item">
                  <a class="professor-card" href="${result.permalink}">
                    <img class="professor-card__image" src="${result.image}">
                    <span class="professor-card__name">${result.title}</span>
                  </a>
                </li>
              `).join('')}
            ${results.professors.length ? '</ul>' : ''}

          </div>
          <div class="one-third">
            <h2 class="search-overlay__section-title">Campuses</h2>
            ${results.campuses.length ? '<ul class="link-list min-list">' : `<p>No campuses match that search query. <a href="${codeschoolData.root_url}/campuses">View all campuses.</a></p>`}
              ${results.campuses.map(result => `<li><a href="${result.permalink}">${result.title}</a></li>`).join('')}
            ${results.campuses.length ? '</ul>' : ''}

            <h2 class="search-overlay__section-title">Events</h2>
            ${results.events.length ? '' : `<p>No events match that search query. <a href="${codeschoolData.root_url}/events">View all events.</a></p>`}
              ${results.events.map(result => `
                <div class="event-summary">
                  <a class="event-summary__date t-center" href="${result.permalink}">
                    <span class="event-summary__month">${result.month}</span>
                    <span class="event-summary__day">${result.day}</span>  
                  </a>
                  <div class="event-summary__content">
                    <h5 class="event-summary__title headline headline--tiny"><a href="${result.permalink}">${result.title}</a></h5>
                    <p>${result.description}<a href="${result.permalink}" class="nu gray"> Learn more</a></p>
                  </div>
                </div>
              `).join('')}

          </div>
        </div>
      `);
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