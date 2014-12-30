var Render_Admin;
(function ($) {
    Render_Admin = {
        init: function () {

        }
    };

    $(function() {
        Render_Admin.init();
    });
})(jQuery);

// Closest Child Plugin
(function($){
    $.fn.closestChildren = function(selector) {
        var $children, $results;

        $children = this.children();

        if ($children.length === 0)
            return $();

        $results = $children.filter(selector);

        if ($results.length > 0)
            return $results;
        else
            return $children.closestChildren(selector);
    };
})(window.jQuery);