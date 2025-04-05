$(document).ready(() => {
    $(document).on('change', '#' + config.translationElementId, (e) => {
        e.preventDefault();
        app.log("changed language");
        app.translate();
    });
});