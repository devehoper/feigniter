class GenericModal {
  static open(config) {
    return new Promise((resolve, reject) => {
      const { title, url, html, size = 'xl', localView } = config;

      $('#genericModal .modal-dialog')
        .removeClass('modal-sm modal-md modal-lg modal-xl')
        .addClass(`modal-${size}`);

      $('#genericModalTitle').text(title || 'Modal');

      if (typeof html !== 'undefined') {
        $('#genericModalBody').html(html);
      } else if (typeof url !== 'undefined' && url.trim() !== '') {
        $('#genericModalBody').html('<div class="text-center text-muted">Loading...</div>');
        $.get(url)
          .done(data => $('#genericModalBody').html(data))
          .fail((xhr, status, error) => {
            $('#genericModalBody').html('<div class="text-danger">Failed to load content.</div>');
            reject(new Error(`Failed to load modal content: ${error}`));
          });
      } else {
        if(typeof app.controllerCache[app.controller] !== "undefined") {
          app.controllerCache[app.controller].loadView(localView, null, null, true, false, "#genericModalBody");
        }
      }

      const modalEl = document.getElementById('genericModal');
      if (!modalEl) {
        reject(new Error('Modal element not found'));
        return;
      }
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
      resolve(modal); // Modal shown successfully

      modalEl.addEventListener('hidden.bs.modal', function handler() {
        modalEl.removeEventListener('hidden.bs.modal', handler);
        $('#genericModalTitle').text('');
        $('#genericModalBody').html('');
        $('#genericModal .modal-dialog').removeClass('modal-sm modal-md modal-lg modal-xl');
        // Modal closed - cleanup done
      });
    });
  }
}

window.openGenericModal = GenericModal.open;
