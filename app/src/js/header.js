// $(".header-item").on('click', (e) => {
//     e.preventDefault();
//     alert("clicked");
//     app.log(e);
// });
$(document).ready(() => {
// //alert("teste");
    $("#language-selector").on('change', (e) => {
        app.log("changed");
        app.translate();
    });
    $("#language-selector").val(Model.getLocalData().language);
    // app.log("teste");
})