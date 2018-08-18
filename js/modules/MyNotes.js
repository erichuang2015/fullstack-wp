class MyNotes {
  constructor() {
    this.events();
  }

  events() {
    jQuery('#my-notes').on('click', '.delete-note', this.deleteNote);
    jQuery('#my-notes').on('click', '.edit-note', this.editNote.bind(this));
    jQuery('#my-notes').on('click', '.update-note', this.updateNote.bind(this));
    jQuery('.submit-note').on('click', this.createNote.bind(this));
  }
  
  // Methods
  editNote(e) {
    var thisNote = jQuery(e.target).parents("li");
    
    if (thisNote.data("state") == "editable") {
      this.makeNoteReadOnly(thisNote);
    } else {
      this.makeNoteEditable(thisNote);
    }
  }

  makeNoteEditable(thisNote) {
    thisNote.find('.edit-note').html('<i class="fa fa-times" aria-hidden="true"></i> Cancel');
    thisNote.find(".note-title-field, .note-body-field").removeAttr('readonly').addClass('note-active-field');
    thisNote.find(".update-note").addClass('update-note--visible');
    thisNote.data("state", "editable");
  }

  makeNoteReadOnly(thisNote) {
    thisNote.find('.edit-note').html('<i class="fa fa-pencil" aria-hidden="true"></i> Edit');
    thisNote.find(".note-title-field, .note-body-field").attr('readonly', 'readonly').removeClass('note-active-field');
    thisNote.find(".update-note").removeClass('update-note--visible');
    thisNote.data("state", "cancel");
  }

  deleteNote(e) {
    var thisNote = jQuery(e.target).parents("li");

    jQuery.ajax({
      beforeSend: (xhr) => {
        xhr.setRequestHeader('X-WP-Nonce', codeschoolData.nonce)
      },
      url: codeschoolData.root_url + '/wp-json/wp/v2/note/' + thisNote.data('id'),
      method: 'DELETE',
      success: (response) => {
        thisNote.slideUp();
        console.log('Deleted!');
        console.log(response);

        if (response.noteCount < 100) {
          jQuery('.note-limit-message').removeClass('active');
        }
      },
      error: (response) => {
        console.log('Error:');
        console.log(response);
      }
    });
  };

  updateNote(e) {
    var thisNote = jQuery(e.target).parents("li");
    var updatedPost = {
      'title': thisNote.find(".note-title-field").val(),
      'content': thisNote.find(".note-body-field").val()
    }

    jQuery.ajax({
      beforeSend: (xhr) => {
        xhr.setRequestHeader('X-WP-Nonce', codeschoolData.nonce)
      },
      url: codeschoolData.root_url + '/wp-json/wp/v2/note/' + thisNote.data('id'),
      method: 'POST',
      data: updatedPost,
      success: (response) => {
        this.makeNoteReadOnly(thisNote);
        console.log('Saved!');
        console.log(response);
      },
      error: (response) => {
        console.log('Error:');
        console.log(response);
      }
    });
  };

  createNote(e) {
    var newPost = {
      'title': jQuery('.new-note-title').val(),
      'content': jQuery('.new-note-body').val(),
      'status': 'publish'
    }

    jQuery.ajax({
      beforeSend: (xhr) => {
        xhr.setRequestHeader('X-WP-Nonce', codeschoolData.nonce)
      },
      url: codeschoolData.root_url + '/wp-json/wp/v2/note/',
      method: 'POST',
      data: newPost,
      success: (response) => {
        jQuery('.new-note-title, .new-note-body').val('');
        jQuery(`
          <li data-id="${response.id}">
            <input readonly class="note-title-field" value="${response.title.raw}" type="text">
            <span class="edit-note"><i class="fa fa-pencil" aria-hidden="true"></i> Edit</span>
            <span class="delete-note"><i class="fa fa-trash-o" aria-hidden="true"></i> Delete</span>
            <textarea readonly class="note-body-field">${response.content.raw}</textarea>
            <span class="update-note btn btn--blue btn--small"><i class="fa fa-arrow-right" aria-hidden="true"></i> Save</span>
          </li>
        `).prependTo('#my-notes').hide().slideDown();

        console.log('Created!');
        console.log(response);
      },
      error: (response) => {
        if (response.responseText == "You have reached your note limit") {
          jQuery(".note-limit-message").addClass('active');
        }

        console.log('Error:');
        console.log(response);
      }
    });
  };
}

var notes = new MyNotes();
