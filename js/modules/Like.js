class Like {
  constructor() {
    this.events();
  }

  events() {
    jQuery('.like-box').on('click', this.clickDispatcher.bind(this));
  }


  // Methods
  clickDispatcher(e) {
    var currentLikeBox = jQuery(e.target).closest('.like-box');

    if (currentLikeBox.attr('data-exists') == 'yes') {
      this.deleteLike(currentLikeBox);
    } else {
      this.createLike(currentLikeBox);
    }
  }

  createLike(currentLikeBox) {
    jQuery.ajax({
      beforeSend: (xhr) => {
        xhr.setRequestHeader('X-WP-Nonce', codeschoolData.nonce)
      },
      url: codeschoolData.root_url + '/wp-json/codeschool/v1/manageLike',
      method: 'POST',
      data: {'professorId': currentLikeBox.data('professor')},
      success: (response) => {
        currentLikeBox.attr('data-exists', 'yes');
        var likeCount = parseInt(currentLikeBox.find('.like-count').html(), 10);
        likeCount++;
        currentLikeBox.find('.like-count').html(likeCount);
        currentLikeBox.attr('data-like', response);
        console.log(response);
      },
      error: (response) => {
        console.log(response);
      }
    })
  }

  deleteLike(currentLikeBox) {
    jQuery.ajax({
      beforeSend: (xhr) => {
        xhr.setRequestHeader('X-WP-Nonce', codeschoolData.nonce)
      },
      url: codeschoolData.root_url + '/wp-json/codeschool/v1/manageLike',
      data: {'like': currentLikeBox.attr('data-like')},
      method: 'DELETE',
      success: (response) => {
        currentLikeBox.attr('data-exists', 'no');
        var likeCount = parseInt(currentLikeBox.find('.like-count').html(), 10);
        likeCount--;
        currentLikeBox.find('.like-count').html(likeCount);
        currentLikeBox.attr('data-like', '');
        console.log(response);
      },
      error: (response) => {
        console.log(response);
      }
    })
  }
}

var like = new Like();
