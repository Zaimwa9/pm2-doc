(function($) {
    var $window = $(window);
    var $document = $(document);

    /*
     * Scrollspy.
     */

    $document.on('flatdoc:ready', function() {

        $('ul.level-2, ul.level-3').addClass('nav');

        $('body').scrollspy({
            target: '#root-list.level-1',
            offset: 20
        });

        $(window).resize(function() {
            $('body').scrollspy('refresh');
        });
       

        $(window).on('scroll', function () {
            $('.level-2').hide();
            $('.level-3').hide();
            var active = $('ul.level-2, ul.level-3').has('a.active');
            if (!active.length) {
                var first = $('li.level-1').eq(0);
                first.find('a.level-1').addClass('active-section');
                first.find('.level-2, .level-3').show();
            }
            active.show();
            active.find('.level-2, .level-3').show();

            $('.active-section').removeClass('active-section');
            var activeSection = $('li.level-1').has('a.active');
            activeSection.children('a').addClass('active-section');
            var noop;
        });
        $('a.level-1').eq(0).addClass('active-section');

        /*
         * COPY CODE FUNCTIONALITY
         */

        $("pre").each(function(){
            $(this).prepend("<a class='copy' title='Copy to clipboard' data-placement='left' href='#'></a>");
        });

        $('a.copy')
            .tooltip()
            .on("click", function (){

                $('a.copy').removeClass("highlight");

                var copyMe = $(this).next().next('code').text();
                window.prompt("Copy to clipboard: Ctrl+C, Enter", copyMe);

                $(this).addClass("highlight");

                return false;
            });
    });

    /*
     * Anchor jump links.
     */

    $document.on('flatdoc:ready', function() {
        $('.menu a').anchorjump();
    });

    /*
     * Title card.
     */

    $(function() {
        var $card = $('.title-card');
        if (!$card.length) return;

        var $header = $('.header');
        var headerHeight = $header.length ? $header.outerHeight() : 0;

        $window
            .on('resize.title-card', function() {
                var windowWidth = $window.width();

                if (windowWidth < 480) {
                    $card.css('height', '');
                } else {
                    var height = $window.height();
                    $card.css('height', height - headerHeight);
                }
            })
            .trigger('resize.title-card');
    });

    /*
     * Sidebar stick.
     */

    $(function() {
        var $sidebar = $('.menubar');
        var elTop;

        $window
            .on('resize.sidestick', function() {
                $sidebar.removeClass('fixed');
                elTop = $sidebar.offset().top;
                $window.trigger('scroll.sidestick');
            })
            .on('scroll.sidestick', function() {
                var scrollY = $window.scrollTop();
                $sidebar.toggleClass('fixed', (scrollY >= elTop));
            })
            .trigger('resize.sidestick');
    });

})(jQuery);
/*! jQuery.scrollagent (c) 2012, Rico Sta. Cruz. MIT License.
 *  https://github.com/rstacruz/jquery-stuff/tree/master/scrollagent */

// Call $(...).scrollagent() with a callback function.
//
// The callback will be called everytime the focus changes.
//
// Example:
//
//      $("h2").scrollagent(function(cid, pid, currentElement, previousElement) {
//        if (pid) {
//          $("[href='#"+pid+"']").removeClass('active');
//        }
//        if (cid) {
//          $("[href='#"+cid+"']").addClass('active');
//        }
//      });

//(function($) {
//
//    $.fn.scrollagent = function() {
//        // Account for $.scrollspy(function)
//        if (typeof callback === 'undefined') {
//            callback = options;
//            options = {};
//        }
//
//        var $sections = $(this);
//        var $parent = options.parent || $(window);
//
//        // Find the top offsets of each section
//        var offsets = [];
//        $sections.each(function(i) {
//            var offset = $(this).attr('data-anchor-offset') ?
//                parseInt($(this).attr('data-anchor-offset'), 10) :
//                (options.offset || 0);
//
//            offsets.push({
//                top: $(this).offset().top + offset,
//                id: $(this).attr('id'),
//                index: i,
//                el: this
//            });
//        });
//
//
//        $(window).on('resize', function() {
//            height = $parent.height();
//            range = $(document).height();
//        });
//
//        // Find the current active section every scroll tick.
//        $parent.on('scroll', function() {
//            var y = $parent.scrollTop();
//            y += height * (0.3 + 0.7 * Math.pow(y/range, 2));
//
//            var latest = null;
//
//            for (var i in offsets) {
//                if (offsets.hasOwnProperty(i)) {
//                    var offset = offsets[i];
//                    if (offset.top < (y-330)) latest = offset;
//                }
//            }
//
//            if (latest && (!current || (latest.index !== current.index))) {
//                callback.call($sections,
//                    latest ? latest.id : null,
//                    current ? current.id : null,
//                    latest ? latest.el : null,
//                    current ? current.el : null);
//                current = latest;
//            }
//
//
//            $('.level-2').hide();
//            $('.level-3').hide();
//            var active = $('ul.level-2, ul.level-3').has('a.active');
//            if (!active.length) {
//              var first = $('li.level-1').eq(0);
//              first.find('a.level-1').addClass('active-section');
//              first.find('.level-2, .level-3').show();
//            }
//            active.show();
//            active.find('.level-2, .level-3').show();
//
//            $('.active-section').removeClass('active-section');
//            var activeSection = $('li.level-1').has('a.active');
//            activeSection.children('a').addClass('active-section');
//            var noop;
//
//        });
//
//        $(window).trigger('resize');
//        $parent.trigger('scroll');
//
//        return this;
//    };
//
//})(jQuery);
/*! Anchorjump (c) 2012, Rico Sta. Cruz. MIT License.
 *   http://github.com/rstacruz/jquery-stuff/tree/master/anchorjump */

// Makes anchor jumps happen with smooth scrolling.
//
//    $("#menu a").anchorjump();
//    $("#menu a").anchorjump({ offset: -30 });
//
//    // Via delegate:
//    $("#menu").anchorjump({ for: 'a', offset: -30 });
//
// You may specify a parent. This makes it scroll down to the parent.
// Great for tabbed views.
//
//     $('#menu a').anchorjump({ parent: '.anchor' });
//
// You can jump to a given area.
//
//     $.anchorjump('#bank-deposit', options);

(function($) {
    var defaults = {
        'speed': 0,
        'offset': 0,
        'for': null,
        'parent': null
    };

    $.fn.anchorjump = function(options) {
        options = $.extend({}, defaults, options);

        if (options['for']) {
            this.on('click', options['for'], onClick);
        } else {
            this.on('click', onClick);
        }

        function onClick(e) {
            var $a = $(e.target).closest('a');
            if (e.ctrlKey || e.metaKey || e.altKey || $a.attr('target')) return;

            e.preventDefault();
            var href = $a.attr('href');

            $.anchorjump(href, options);
        }
    };

    // Jump to a given area.
    $.anchorjump = function(href, options) {
        options = $.extend({}, defaults, options);

        var top = 0;

        if (href != '#') {
            var $area = $(href);
            // Find the parent
            if (options.parent) {
                var $parent = $area.closest(options.parent);
                if ($parent.length) { $area = $parent; }
            }
            if (!$area.length) { return; }

            // Determine the pixel offset; use the default if not available
            var offset =
                $area.attr('data-anchor-offset') ?
                    parseInt($area.attr('data-anchor-offset'), 10) :
                    options.offset;

            top = Math.max(0, $area.offset().top + offset);
        }

        $('html, body').animate({ scrollTop: top }, options.speed);
        $('body').trigger('anchor', href);

        // Add the location hash via pushState.
        if (window.history.pushState) {
            window.history.pushState({ href: href }, "", href);
        }
    };
})(jQuery);