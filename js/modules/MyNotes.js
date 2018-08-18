class MyNotes {
  constructor() {
    this.events();
  }

  events() {
    jQuery('.delete-note').on('click', this.deleteNote);
    jQuery('.edit-note').on('click', this.editNote.bind(this));
    jQuery('.update-note').on('click', this.updateNote.bind(this));
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
}

var notes = new MyNotes();
