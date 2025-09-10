function openGenericModal(config) {
  const { title, url, html, size = 'xl', localView } = config;

  // Set modal size
  $('#genericModal .modal-dialog')
    .removeClass('modal-sm modal-md modal-lg modal-xl')
    .addClass(`modal-${size}`);

  // Set title
  $('#genericModalTitle').text(title || 'Modal');

  // Load content
  if (html) {
    $('#genericModalBody').html(html);
  } else if (url) {
    $('#genericModalBody').html('<div class="text-center text-muted">Loading...</div>');
    $.get(url)
      .done(data => $('#genericModalBody').html(data))
      .fail(() => $('#genericModalBody').html('<div class="text-danger">Failed to load content.</div>'));
  } else {
     app.controllerCache[app.controller].loadView(localView, null, null, true, false, selector = "#genericModalBody");
  }

  // Show modal
  const modal = new bootstrap.Modal(document.getElementById('genericModal'));
  modal.show();

  
}

document.getElementById('genericModal').addEventListener('hidden.bs.modal', function () {
  // Clear title and body
  document.getElementById('genericModalTitle').textContent = '';
  document.getElementById('genericModalBody').innerHTML = '';

  // Optional: remove modal size classes
  const dialog = document.querySelector('#genericModal .modal-dialog');
  dialog.classList.remove('modal-sm', 'modal-md', 'modal-lg', 'modal-xl');
});
