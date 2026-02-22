class GenericSpinner {
  static toggle() {
    if ($("#spinner").length > 0) {
      // Show loader on any AJAX start
      if ($("#spinner").hasClass("visually-hidden")) {
        $("#spinner").removeClass("visually-hidden");
        $("#spinner").addClass("visually-visible");
      } else {
        $("#spinner").removeClass("visually-visible");
        $("#spinner").addClass("visually-hidden");
      }
    }
  }
}

window.toggleSpinner = GenericSpinner.toggle;