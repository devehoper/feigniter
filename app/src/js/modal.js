function openGenericModal(config) {
  return new Promise((resolve) => {
    const { title, url, html, size = 'xl', localView } = config;

    $('#genericModal .modal-dialog')
      .removeClass('modal-sm modal-md modal-lg modal-xl')
      .addClass(`modal-${size}`);

    $('#genericModalTitle').text(title || 'Modal');

    if (html) {
      $('#genericModalBody').html(html);
    } else if (url) {
      $('#genericModalBody').html('<div class="text-center text-muted">Loading...</div>');
      $.get(url)
        .done(data => $('#genericModalBody').html(data))
        .fail(() => $('#genericModalBody').html('<div class="text-danger">Failed to load content.</div>'));
    } else {
      app.controllerCache[app.controller].loadView(localView, null, null, true, false, "#genericModalBody");
    }

    const modalEl = document.getElementById('genericModal');
    const modal = new bootstrap.Modal(modalEl);
    modal.show();

    modalEl.addEventListener('hidden.bs.modal', function handler() {
      modalEl.removeEventListener('hidden.bs.modal', handler);
      $('#genericModalTitle').text('');
      $('#genericModalBody').html('');
      $('#genericModal .modal-dialog').removeClass('modal-sm modal-md modal-lg modal-xl');
      resolve(); // Modal closed
    });
  });
}
