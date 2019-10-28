function init_materialize() {
    $('select').formSelect();
}

/**
 * Initialize Alertify Properties
 */
function initialize_alertify_properties() {
    alertify.setPosition(false, 1);
    alertify.setTemplate(function (input) {
        return "<b>" + input + "</b>";
    });
}

function init_all() {
    init_materialize();
    initialize_alertify_properties();
}

function loadScript(url, callback)
{
    // Adding the script tag to the head as suggested before
    var head = document.head;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
}

angular.element(function () { // When all angular elements are ready
    $('select').formSelect();
});

(function($) {
    $(document).ready(function(){
        init_all();
    });
})(jQuery);