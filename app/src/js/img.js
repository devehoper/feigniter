$(document).ready(function () {
  $('body').on('click', 'img.preview', function () {
    const src = $(this).attr('src');

    // Remove any existing preview
    $('#img-preview').remove();

    // Create the preview element
    const modal = $('<div id="img-preview">')
      .css('background-image', `url(${src})`)
      .addClass('show')
      .click(function () {
        $(this).remove();
        $(document).off('keyup.imgPreview');
      });

    $('body').append(modal);

    // ESC key to close
    $(document).on('keyup.imgPreview', function (e) {
      if (e.key === 'Escape') {
        modal.remove();
        $(document).off('keyup.imgPreview');
      }
    });
  });
});
