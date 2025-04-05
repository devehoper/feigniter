$(document).ready(() => {
    $("#" + config.translationElementId).val(app.models.AppModel.language || config.defaultLanguage);
    $(document).on('change', '#' + config.translationElementId, (e) => {
        e.preventDefault();
        app.log("changed language");
        app.translate();
    });
});