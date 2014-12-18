/**
 * Functionality for the USL modal.
 *
 * @since USL 1.0.0
 *
 * @global USL_Data
 *
 * @package USL
 * @subpackage Modal
 */
var USL_Modal;
(function ($) {
    var elements = {},
        shortcodes = {},
        slide_transition = 150,
        categories_sliding = false,
        usl_modal_open = false,
        _search_timeout, search_loading, textbox_focused,
        error_color = '#ec6750';

    USL_Modal = {

        current_shortcode: '',
        active_shortcode: '',
        output: '',
        selection: '',
        modifying: false,

        init: function () {

            this.establishElements();
            this.binds();
            this.keyboardShortcuts();
            this.preventWindowScroll();
            this.search();
        },

        load: function () {
        },

        resize: function () {
            this.listHeight();
        },

        establishElements: function () {
            elements.wrap = $('#usl-modal-wrap');
            elements.submit = $('#usl-modal-submit');
            elements.backdrop = $('#usl-modal-backdrop');
            elements.cancel = elements.wrap.find('.usl-modal-cancel');
            elements.close = elements.wrap.find('.usl-modal-close');
            elements.remove = $('#usl-modal-remove');
            elements.title = elements.wrap.find('.usl-modal-title');
            elements.search = elements.wrap.find('.usl-modal-search');
            elements.categories = elements.wrap.find('.usl-modal-categories');
            elements.footer = elements.wrap.find('.usl-modal-footer');
            elements.list = elements.wrap.find('.usl-modal-shortcodes');
            elements.search_input = elements.wrap.find('input[name="usl-modal-search"]');
            elements.active_shortcode = false;
            elements.last_active_shortcode = false;
        },

        binds: function () {

            // Active a shortcode
            elements.list.find('.accordion-section-title, .usl-modal-sc-title').click(function () {
                USL_Modal.activateShortcode($(this));
            });

            // Shortcode toolbar toggle
            elements.list.find('.usl-modal-shortcode-toolbar-toggle').click(function () {
                USL_Modal.shortcodeToolbarTogggle($(this));
            });

            // Restore shortcode
            elements.list.find('.usl-modal-shortcode-toolbar-button-restore').click(function () {

                if (!$(this).hasClass('disabled')) {
                    USL_Modal.restoreShortcode();
                }
            });

            // Submit the form
            elements.submit.off('click').click(function (event) {
                event.preventDefault();
                USL_Modal.update();
            });

            // Remove button
            elements.remove.click(function () {
                $(document).trigger('usl-modal-remove');
            });

            // Close the form
            elements.cancel.click(function (event) {
                event.preventDefault();
                USL_Modal.close();
            });
            elements.close.click(function (event) {
                event.preventDefault();
                USL_Modal.close();
            });

            // Filter shortcodes by category
            elements.categories.find('li').click(function () {
                USL_Modal.filterByCategory($(this));
            });

            // Show advanced atts
            elements.list.find('.usl-modal-show-advanced-atts').click(function () {
                USL_Modal.toggleAdvancedAtts($(this));
                return false;
            });

            // Move categories left and right
            elements.categories.find('.usl-modal-categories-left').click(USL_Modal.moveCategoriesLeft);
            elements.categories.find('.usl-modal-categories-right').click(USL_Modal.moveCategoriesRight);
        },

        keyboardShortcuts: function () {

            $(document).keyup(function (e) {

                if (!usl_modal_open) {
                    return;
                }

                switch (e.which) {

                    // Enter
                    case 13:

                        e.preventDefault();

                        if (textbox_focused) {
                            break;
                        }

                        USL_Modal.update();
                        break;

                    // Escape
                    case 27:
                        USL_Modal.close();
                        break;

                    // Tab
                    case 9:

                        if (elements.search.find('input[type="text"]').is(':focus')) {

                            e.preventDefault();

                            if (elements.active_shortcode) {
                                elements.active_shortcode.find('.usl-modal-att-row').first().focus();
                            } else {

                                elements.list.find('li').each(function () {

                                    if ($(this).is(':visible')) {

                                        var $first = $(this);
                                        if ($next.length && $next.is(':visible')) {

                                            elements.active_shortcode = $first;
                                            USL_Modal.openShortcode();
                                        }
                                        return false;
                                    }
                                });
                            }
                        }
                        break;

                    // Down arrow
                    case 40:

                        e.preventDefault();

                        var $next;
                        if (!elements.active_shortcode) {

                            elements.list.find('li').each(function () {

                                if ($(this).is(':visible')) {

                                    $next = $(this);
                                    if ($next.length && $next.is(':visible')) {

                                        elements.active_shortcode = $next;
                                        USL_Modal.openShortcode();
                                    }
                                    return false;
                                }
                            });
                        } else {
                            $next = elements.active_shortcode.next();

                            if ($next.length && $next.is(':visible')) {

                                USL_Modal.closeShortcode();
                                elements.active_shortcode = $next;
                                USL_Modal.openShortcode();
                            } else {
                                elements.active_shortcode.effect('shake', {
                                    distance: 10
                                }, 200);
                            }
                        }
                        break;

                    // Up arrow
                    case 38:

                        e.preventDefault();

                        var $prev;
                        if (!elements.active_shortcode) {

                            $(elements.list.find('li').get().reverse()).each(function () {
                                //elements.list.find('li').each(function () {

                                if ($(this).is(':visible')) {

                                    $prev = $(this);
                                    if ($prev.length && $prev.is(':visible')) {

                                        elements.active_shortcode = $prev;
                                        USL_Modal.openShortcode();
                                    }
                                    return false;
                                }
                            });
                        } else {
                            $prev = elements.active_shortcode.prev();

                            if ($prev.length && $prev.is(':visible')) {

                                USL_Modal.closeShortcode();
                                elements.active_shortcode = $prev;
                                USL_Modal.openShortcode();
                            } else {
                                elements.active_shortcode.effect('shake', {
                                    distance: 10
                                }, 200);
                            }
                        }
                        break;
                    default:
                        return;
                }
            });
        },

        moveCategoriesLeft: function () {

            var $list = elements.categories.find('ul'),
                individual_width = elements.categories.find('li').width(),
                current_offset = $list.css('left') != 'auto' ? parseInt($list.css('left')) : 0;

            if (current_offset < 0 && !categories_sliding) {
                categories_sliding = true;
                $list.animate({left: current_offset + individual_width}, {
                    duration: 300,
                    complete: function () {
                        categories_sliding = false;
                    }
                });
            }
        },

        moveCategoriesRight: function () {

            var $list = elements.categories.find('ul'),
                individual_width = elements.categories.find('li').width(),
                total_width = elements.categories.find('li').length * individual_width,
                visible_width = 5 * individual_width,
                max_offset = (total_width - visible_width) * -1,
                current_offset = $list.css('left') != 'auto' ? parseInt($list.css('left')) : 0;

            if (current_offset > max_offset && !categories_sliding) {
                categories_sliding = true;

                $list.animate({left: current_offset + (individual_width * -1)}, {
                    duration: 300,
                    complete: function () {
                        categories_sliding = false;
                    }
                });
            }
        },

        initAtts: function () {

            elements.active_shortcode.find('.usl-modal-att-row').each(function () {

                // Skip if already initialized or if set to not initialize
                if ($(this).data('attObj') || $(this).attr('data-no-init')) {
                    return true; // Continue $.each
                }

                var att_type = $(this).attr('data-att-type'),
                    attObj;

                // Initialize each type of att (this is as big one!)
                switch (att_type) {
                    case 'selectbox':

                        attObj = new Selectbox($(this));

                        // Apply Chosen
                        var $chosen = $(this).find('.chosen'),
                            $container = $chosen.closest('.usl-modal-att-field');

                        $chosen.chosen({
                            width: '100%',
                            search_contains: true,
                            allow_single_deselect: true,
                            disable_search: $chosen.hasClass('allow-icons')
                        });

                        // Fix scroll issue
                        $container.find('.chosen-results').bind('mousewheel', function (e) {
                            $(this).scrollTop($(this).scrollTop() - e.originalEvent.wheelDeltaY);
                            return false;
                        });

                        // Extend functionality to allow icons
                        if ($chosen.hasClass('allow-icons')) {

                            $chosen.on('chosen:showing_dropdown chosen:updated', function () {

                                $(this).find('option').each(function (index) {

                                    var icon = $(this).attr('data-icon');

                                    if (!icon) {
                                        return true; // Continue &.each
                                    }

                                    if (icon) {
                                        $container.find('.chosen-results li').eq(index - 1).prepend(
                                            '<span class="' + icon + '"></span>'
                                        )
                                    }
                                });
                            });

                            $chosen.on('change', function () {

                                var icon = 'dashicons ' + $chosen.val();

                                if (!$chosen.val()) {
                                    $container.find('.chosen-single .dashicons').remove();
                                } else {
                                    $container.find('.chosen-single span').prepend(
                                        '<span class="' + icon + '"></span>'
                                    );
                                }
                            });
                        }

                        // Extend functionality to allow custom text input (if enabled on input)
                        // TODO Find a way to allow searching of option values as well as text
                        if ($chosen.hasClass('allow-custom-input')) {
                            //$container.find('.chosen-container').addClass('allow-custom-input');
                            chosen_custom_input($chosen);
                        }
                        break;
                    case 'colorpicker':

                        attObj = new Colorpicker($(this));

                        $(this).find('.usl-modal-att-colorpicker').each(function () {
                            var data = $(this).data();
                            $(this).wpColorPicker(data);
                        });
                        break;

                    case 'slider':

                        attObj = new Slider($(this));

                        $(this).find('.usl-modal-att-slider').each(function () {

                            var $this = $(this),
                                data = $this.data(),
                                $input = $this.siblings('.usl-modal-att-slider-value');

                            // Skip if the slider's already been initilaized
                            if (typeof data.uiSlider !== 'undefined') {
                                return true; // Continue $.each
                            }

                            // If the input had a number, and a default isn't set, use it
                            if ($input.val() && !data.value) {
                                if (data.range) {
                                    data.values = $input.val();
                                } else {
                                    data.value = $input.val();
                                }
                            }

                            // Custom slide callback
                            if (data.slide) {

                                var slide_callback = data.slide;

                                data.slide = function (event, ui) {
                                    return window[slide_callback](event, ui, $input);
                                }
                            } else {
                                if (data.range) {
                                    data.slide = function (event, ui) {

                                        // Prevent overlap
                                        if (ui.values[0] >= ui.values[1] || ui.values[1] <= ui.values[0]) {
                                            return false;
                                        }

                                        // Output the ranges to the text and the input
                                        var $text = $input.siblings('.usl-modal-att-slider-range-text');

                                        $text.find('.usl-modal-att-slider-range-text-value1').html(ui.values[0]);
                                        $text.find('.usl-modal-att-slider-range-text-value2').html(ui.values[1]);

                                        $input.val(ui.values[0] + '-' + ui.values[1]);
                                    };
                                } else {
                                    data.slide = function (event, ui) {
                                        $input.val(ui.value);
                                    };
                                }
                            }

                            // Set the values to an array (if a range slider)
                            if (data.range) {
                                data.values = data.values.split('-');
                            }

                            // Make sure this gets no duplicate handlers
                            $input.off();

                            // Only numbers (or negative)
                            $input.keypress(function (e) {

                                if (!String.fromCharCode(e.which).match(/[0-9|-]/)) {
                                    highlight($(this));
                                    e.preventDefault();
                                }
                            });

                            // Change the slider and keep the numbers in the allowed range
                            $input.change(function () {

                                var $slider = $(this).siblings('.usl-modal-att-slider');

                                if ($slider.attr('data-range')) {

                                    // Range slider
                                    var $text = $(this).siblings('.usl-modal-att-slider-range-text'),
                                        values = $(this).val().split('-');

                                    $text.find('.usl-modal-att-slider-range-text-value1').html(values[0]);
                                    $text.find('.usl-modal-att-slider-range-text-value2').html(values[1]);

                                    $slider.slider('values', values);
                                } else {

                                    // Normal slider
                                    var min = parseInt($slider.attr('data-min')),
                                        max = parseInt($slider.attr('data-max')),
                                        val = parseInt($(this).val());

                                    // Set the jQuery UI slider to match the new text value
                                    $slider.slider('value', $(this).val());

                                    // Keep in range
                                    if (val < min) {
                                        highlight($(this));
                                        $(this).val(min);
                                    } else if (val > max) {
                                        highlight($(this));
                                        $(this).val(max);
                                    }

                                    // Erase leading zeros
                                    $(this).val(parseInt($(this).val(), 10));
                                }
                            });

                            // Initialize the slider
                            $this.slider(data);
                        });

                        break;

                    case 'counter':

                        attObj = new Counter($(this));

                        var shift_down = false,
                            $input = $(this).find('.usl-modal-att-counter'),
                            $button_down = $input.siblings('.usl-modal-counter-down'),
                            $button_up = $input.siblings('.usl-modal-counter-up'),
                            min = parseInt($input.attr('data-min')),
                            max = parseInt($input.attr('data-max')),
                            step = parseInt($input.attr('data-step')),
                            shift_step = parseInt($input.attr('data-shift-step'));

                        // Set the "+" and "-" to disabled accordingly
                        if (parseInt($input.val()) == min) {
                            $button_down.addClass('disabled');
                        } else {
                            $button_down.removeClass('disabled');
                        }

                        if (parseInt($input.val()) == max) {
                            $button_up.addClass('disabled');
                        } else {
                            $button_up.removeClass('disabled');
                        }

                        // If holding shift, let us know so we can use the shift_step later
                        $(document).keydown(function (e) {
                            if (e.which === 16) {
                                shift_down = true;
                            }
                        });

                        $(document).keyup(function (e) {
                            if (e.which === 16) {
                                shift_down = false;
                            }
                        });

                        // Click on the "+"
                        $(this).find('.usl-modal-counter-up').click(function () {
                            $input.val(parseInt($input.val()) + (shift_down ? shift_step : step));
                            $input.change();
                        });

                        // Click on the "-"
                        $(this).find('.usl-modal-counter-down').click(function () {
                            $input.val(parseInt($input.val()) - (shift_down ? shift_step : step));
                            $input.change();
                        });

                        // Keep the number within its limits
                        $input.off().change(function () {

                            var $button_up = $(this).siblings('.usl-modal-counter-up'),
                                $button_down = $(this).siblings('.usl-modal-counter-down');

                            if (parseInt($(this).val()) >= max) {

                                if (parseInt($(this).val()) > max) {
                                    highlight($(this));
                                }

                                $(this).val(max);
                                $button_up.addClass('disabled');
                                $button_down.removeClass('disabled');
                            } else if (parseInt($(this).val()) <= min) {

                                if (parseInt($(this).val()) < min) {
                                    highlight($(this));
                                }

                                $(this).val(min);
                                $button_down.addClass('disabled');
                                $button_up.removeClass('disabled');
                            } else {

                                $button_up.removeClass('disabled');
                                $button_down.removeClass('disabled');
                            }
                        });

                        // Units selectbox
                        var $select = $(this).find('select');

                        if ($select.length) {

                            $select.chosen({
                                width: '100px',
                                search_contains: true,
                                allow_single_deselect: true
                            });

                            chosen_custom_input($select);
                        }

                        break;

                    case 'repeater':

                        attObj = new Repeater($(this));

                        initRepeaterButtons($(this));

                        break;
                    default:

                        attObj = new Textbox($(this));

                        $(this).find('.usl-modal-att-input').focusin(function () {
                            textbox_focused = true;
                        });

                        $(this).find('.usl-modal-att-input').focusout(function () {
                            textbox_focused = false;
                        });
                        break;
                }

                $(this).data('attObj', attObj);

                // Custom callback
                if ($(this).attr('data-init-callback')) {
                    window[$(this).attr('data-init-callback')]($(this), attObj);
                }
            });
        },

        search: function () {

            var search_delay = 300,
                search_fade = 300;

            elements.search_input.on('keyup', function (e) {

                // Don't search for certain keys
                if (e.which == 9 || e.which == 13 || e.which == 40 || e.which == 38) {
                    return;
                }

                var search_query = $(this).val(),
                    matches = search_query.match(/[a-zA-Z0-9\s]/g);

                // Don't search if the query isn't allowed characters
                if (search_query.length && (matches === null || matches.length !== search_query.length)) {
                    USL_Modal.invalidSearch(true);
                    return;
                } else {
                    USL_Modal.invalidSearch(false);
                }

                // Don't search if empty
                if (!search_query.length) {
                    USL_Modal.clearSearch(search_fade);
                    return;
                }

                if (!search_loading) {
                    elements.list.stop().animate({opacity: 0}, search_fade);
                }

                search_loading = true;

                clearTimeout(_search_timeout);
                _search_timeout = setTimeout(function () {

                    search_loading = false;
                    elements.list.stop().animate({opacity: 1}, search_fade);
                    elements.list.scrollTop(0);
                    USL_Modal.closeShortcode();

                    elements.list.find('.usl-modal-shortcode').each(function () {
                        var title = $(this).find('.usl-modal-shortcode-title').text(),
                            description = $(this).find('.description').text(),
                            code = $(this).attr('data-code'),
                            source = $(this).attr('data-source'),
                            search_string = title + description + code + source;

                        if (search_string.toLowerCase().indexOf(search_query.toLowerCase()) < 0) {
                            $(this).hide();
                        } else {
                            $(this).show();
                        }
                    });
                }, search_delay);
            });
        },

        clearSearch: function (time) {

            time = typeof time === 'undefined' ? 0 : time;
            elements.search_input.val('');
            elements.list.find('.usl-modal-shortcode').show();
            clearTimeout(_search_timeout);
            this.closeShortcode();
            elements.list.stop().animate({opacity: 1}, time);
            search_loading = false;
        },

        invalidSearch: function (invalid) {

            var $invalidsearch = elements.wrap.find('.usl-modal-invalidsearch');

            if (invalid) {
                $invalidsearch.show();
            } else {
                $invalidsearch.hide();
            }
        },

        activateShortcode: function ($e) {

            var $container = $e.closest('.usl-modal-shortcode');

            this.clearShortcodeErrors();

            // Bail if the shortcode is disabled
            if ($container.hasClass('disabled')) {

                // Error message
                var $description = $container.find('.usl-modal-shortcode-description');
                $description.data('shortcodeDescriptionText', $description.html());
                $description.html('Please select content from the editor to enable this shortcode.');

                $container.addClass('usl-modal-shortcode-error-message');

                highlight($container);

                return;
            }

            if ($container.hasClass('active')) {
                this.closeShortcode();
                elements.active_shortcode = false;
                elements.last_active_shortcode = false;
                this.active_shortcode = '';
                return;
            }

            this.closeShortcode();

            elements.active_shortcode = $container;
            this.active_shortcode = $container.attr('data-code');

            // Change submit button
            if (this.modifying) {

                if (elements.active_shortcode.hasClass('current-shortcode')) {
                    this.submitButton('modify');
                } else {
                    this.submitButton('change');
                }
            } else {
                this.submitButton('add');
            }

            // Enable / Disable restore button
            if (this.modifying && this.active_shortcode === this.current_shortcode.code) {
                elements.active_shortcode.find('.usl-modal-shortcode-toolbar-button-restore').removeClass('disabled');
            } else {
                elements.active_shortcode.find('.usl-modal-shortcode-toolbar-button-restore').addClass('disabled');
            }

            this.openShortcode();
        },

        shortcodeToolbarTogggle: function ($this, force) {

            force = typeof force !== 'undefined' ? force : false;

            var transition = 300,
                $tools = $this.siblings('.usl-modal-shortcode-toolbar-tools');

            if ($this.hasClass('open') || force === 'close') {

                $this.removeClass('open dashicons-arrow-up-alt2').addClass('dashicons-arrow-down-alt2');

                $tools.stop().animate({
                    height: 0
                }, transition);
            } else if (!$this.hasClass('open') || force === 'open') {

                $this.addClass('open dashicons-arrow-up-alt2').removeClass('dashicons-arrow-down-alt2');

                $tools.stop().animate({
                    height: '50px'
                }, transition);
            }
        },

        restoreShortcode: function () {
            this.populateShortcode(this.current_shortcode.atts);
        },

        clearShortcodeErrors: function () {

            // Remove any previous error messages
            elements.list.find('.usl-modal-shortcode.usl-modal-shortcode-error-message').
                find('.usl-modal-shortcode-description').each(function () {
                    $(this).html($(this).data('shortcodeDescriptionText'));
                    $(this).closest('.usl-modal-shortcode').removeClass('usl-modal-shortcode-error-message');
                });
        },

        toggleAdvancedAtts: function ($e) {

            if ($e.hasClass('hidden')) {
                this.showAdvancedAtts($e);
            } else {
                this.hideAdvancedAtts($e);
            }
        },

        showAdvancedAtts: function ($e) {

            $e.removeClass('hidden');
            $e.siblings('.usl-modal-advanced-atts').show();
            $e.find('.show-text').hide();
            $e.find('.hide-text').show();
        },

        hideAdvancedAtts: function ($e) {

            $e.addClass('hidden');
            $e.siblings('.usl-modal-advanced-atts').hide();
            $e.find('.hide-text').hide();
            $e.find('.show-text').show();
        },

        preventWindowScroll: function () {

            elements.list.bind('mousewheel', function (e) {

                $(this).scrollTop($(this).scrollTop() - e.originalEvent.wheelDeltaY);
                return false;
            });
        },

        filterByCategory: function ($e) {

            var category = $e.attr('data-category'),
                shortcodes = elements.list.find('li');

            // Set all other categories to inactive, and this one to active
            elements.categories.find('li').removeClass('active');
            $e.addClass('active');

            // Clear previously activated and opened items and clear forms
            this.refresh();
            this.closeShortcode();
            elements.active_shortcode = false;

            if (category === 'all') {
                shortcodes.show();
            } else {
                shortcodes.each(function () {
                    if (category !== $(this).attr('data-category')) {
                        $(this).hide();
                    } else {
                        $(this).show();
                    }
                });
            }

            this.refreshRows();
        },

        refreshRows: function () {

            var i = 0;
            elements.list.find('> li').each(function () {

                if ($(this).css('display') === 'none') {
                    return true;
                }

                if (i % 2) {
                    $(this).addClass('alt');
                } else {
                    $(this).removeClass('alt');
                }
                i++;
            })
        },

        listHeight: function () {

            var height = elements.wrap.innerHeight()
                - elements.title.outerHeight(true)
                - elements.search.outerHeight(true)
                - elements.categories.outerHeight(true)
                - elements.wrap.find('.dashicons-leftright').outerHeight(true)
                - elements.footer.outerHeight(true);

            elements.list.height(height);
        },

        removeButton: function (which) {

            which = which.toLowerCase();

            if (which == 'show') {
                elements.remove.show();
            } else {
                elements.remove.hide();
            }
        },

        submitButton: function (which) {

            var _which = which.toLowerCase();

            function transition($button) {

                var orig_width, width,
                    $buttons = elements.submit.find('[class^="usl-modal-submit-text"]'),
                    offset = $button.height() * $button.index('[class^="usl-modal-submit-text"]') * -1;

                orig_width = elements.submit.width();
                elements.submit.width('auto');
                width = $button.width();
                elements.submit.width(orig_width);

                elements.submit.animate({
                    width: width
                }, 400);


                if (offset != parseInt($button.css('top'))) {
                    $buttons.addClass('blur').animate({
                        top: offset
                    }, {
                        duration: 200,
                        complete: function () {
                            $(this).removeClass('blur');
                        }
                    });
                }
            }

            switch (_which) {
                case 'add':
                    elements.submit.removeClass('disabled');
                    transition(elements.submit.find('.usl-modal-submit-text-add'));

                    break;
                case 'modify':
                    elements.submit.removeClass('disabled');
                    transition(elements.submit.find('.usl-modal-submit-text-modify'));

                    break;
                case 'change':
                    elements.submit.removeClass('disabled');
                    transition(elements.submit.find('.usl-modal-submit-text-change'));

                    break;
                case 'disable':
                    elements.submit.addClass('disabled');
                    break;
                default:
                    throw new Error('USL: submitButton() has no button type "' + which + '"');
            }
        },

        modify: function (shortcode) {

            // Crop off any whitespace (generally preceding)
            shortcode = shortcode.trim();

            // Get our shortcode regex (localized)
            var shortcode_regex = USL_Data.shortcode_regex;

            // Make it compatible with JS (originally in PHP)
            shortcode_regex = shortcode_regex.replace(/\*\+/g, '*');

            // Turn it into executable regex and use it on our code
            var matches = new RegExp(shortcode_regex).exec(shortcode),
                code = matches[2],
                _atts = matches[3], atts = {},
                content = matches[5];

            // Get our att pairs
            var attRegEx = /(\w+)\s*=\s*"([^"]*)"(?:\s|$)|(\w+)\s*=\s*\'([^\']*)\'(?:\s|$)|(\w+)\s*=\s*([^\s\'"]+)(?:\s|$)|"([^"]*)"(?:\s|$)|(\S+)(?:\s|$)/g,
                match;

            while (match = attRegEx.exec(_atts)) {
                atts[match[3]] = match[4];
            }

            // Add on the content
            if (content) {
                atts.content = content;
            }

            this.modifying = true;

            this.setActiveShortcode(code);

            elements.active_shortcode.addClass('current-shortcode');

            this.current_shortcode = {
                all: shortcode,
                code: code,
                atts: atts
            };

            this.open();

            this.activateShortcode(elements.active_shortcode);

            this.populateShortcode(atts);
        },

        setActiveShortcode: function (shortcode) {

            // Find our current shortcode
            elements.list.find('li').each(function () {
                if ($(this).attr('data-code') === shortcode) {
                    elements.active_shortcode = $(this);
                }
            });
        },

        populateShortcode: function (atts) {

            $.each(atts, function (name, value) {

                var attObj = elements.active_shortcode.find('.usl-modal-att-row[data-att-name="' + name + '"]').data('attObj');

                if (attObj) {
                    attObj.setValue(value);
                }
            });
        },

        closeShortcode: function () {

            if (elements.active_shortcode) {

                elements.active_shortcode.removeClass('active');

                elements.active_shortcode.find('.accordion-section-content').slideUp(slide_transition);

                USL_Modal.hideAdvancedAtts(elements.active_shortcode.find('.usl-modal-show-advanced-atts'));

                if (!elements.active_shortcode.hasClass('current-shortcode')) {
                    USL_Modal.refresh();
                }

                this.shortcodeToolbarTogggle(elements.active_shortcode.find('.usl-modal-shortcode-toolbar-toggle'), 'close');

                elements.last_active_shortcode = elements.active_shortcode;
                elements.active_shortcode = false;

                this.submitButton('disable');
            }
        },

        openShortcode: function () {

            if (elements.active_shortcode) {

                // Activate it
                elements.active_shortcode.addClass('active');

                // Open it if it's an accordion
                if (elements.active_shortcode.hasClass('accordion-section')) {
                    elements.active_shortcode.find('.accordion-section-content').slideDown(slide_transition);
                }

                // Init the atts (needs to be after the accordion opening to render Chosen properly)
                if (!elements.active_shortcode.data('attsInit')) {
                    this.initAtts();
                    elements.active_shortcode.data('attsInit', true);
                }

                // Scroll it into view
                var shortcode_offset = elements.active_shortcode.position(),
                    scrollTop = elements.list.scrollTop(),
                    offset = shortcode_offset.top + scrollTop;

                // If the last activated shortcode was an accordion AND that element was above this, we need to
                // compensate the scroll for it
                if (elements.last_active_shortcode &&
                    elements.active_shortcode.position().top > elements.last_active_shortcode.position().top &&
                    elements.last_active_shortcode.hasClass('accordion-section')
                ) {
                    offset = offset - elements.last_active_shortcode.find('.accordion-section-content').outerHeight();
                }

                elements.list.stop().animate({
                    scrollTop: offset
                });
            }
        },

        open: function () {

            usl_modal_open = true;

            if (!this.selection) {
                elements.list.find('.usl-modal-shortcode.wrapping').addClass('disabled');
            } else {
                elements.list.find('.usl-modal-shortcode.wrapping.disabled').removeClass('disabled');
            }

            this.refreshRows();

            elements.wrap.show();
            elements.backdrop.show();

            elements.search.find('input[name="usl-modal-search"]').focus();

            this.listHeight();

            // Buttons
            if (this.modifying) {
                this.submitButton('modify');
                this.removeButton('show');
            } else {
                this.submitButton('add');
                this.submitButton('disable');
            }

            $(document).trigger('usl-modal-open');
        },

        close: function () {

            usl_modal_open = false;

            elements.list.scrollTop(0);
            elements.wrap.hide();
            elements.backdrop.hide();

            this.closeShortcode();
            this.clearShortcodeErrors();
            this.clearSearch();

            // Refresh categories at top
            elements.categories.find('.active').removeClass('active');
            elements.categories.find('li').first().addClass('active');
            elements.categories.find('> ul').css('left', 0);

            // Reset buttons
            elements.remove.hide();

            elements.list.find('.current-shortcode').removeClass('current-shortcode');

            this.modifying = false;
            this.current_shortcode = false;
            this.active_shortcode = '';
            this.selection = '';

            $(document).trigger('usl-modal-close');
        },

        update: function () {

            if (!elements.active_shortcode || !this.validate() || elements.submit.hasClass('disabled')) {
                return;
            }

            this.sanitize();

            var code = elements.active_shortcode.attr('data-code'),
                title = elements.active_shortcode.find('.usl-modal-shortcode-title').html(),
                props, output, atts = {}, selection = this.selection;

            // Get the atts
            elements.active_shortcode.find('.usl-modal-att-row').each(function () {

                var attObj = $(this).data('attObj');

                // Skip if no attObj
                if (!attObj) {
                    return true; // Continue $.each
                }

                if (!attObj.disabled) {
                    atts[attObj.name] = attObj.getValue();
                }
            });

            props = USL_Data.all_shortcodes[code];

            output = '[' + code;

            // Add on atts if they exist
            if (atts) {
                $.each(atts, function (name, value) {

                    // Set up the selection to be content if it exists
                    if (name === 'content') {
                        selection = value;
                        return true; // Continue $.each
                    }

                    // Add the att to the shortcode output
                    if (value.length) {
                        output += ' ' + name + '=\'' + usl_encode_attr(value, ['\"']) + '\'';
                    }
                });
            }

            output += ']';

            if (props.wrapping) {
                output += selection + '[/' + code + ']';
            }

            this.output = {
                all: output,
                code: code,
                atts: atts,
                title: title
            };

            $(document).trigger('usl-modal-update');

            this.close();
        },

        validate: function () {

            var validated = true;

            elements.active_shortcode.find('.usl-modal-att-row').each(function () {

                var attObj = $(this).data('attObj');

                // Skip if no attObj
                if (!attObj) {
                    return true; // Continue $.each
                }

                var required = attObj.$container.attr('data-required'),
                    validate = attObj.$container.attr('data-validate'),
                    att_value = attObj.getValue(),
                    att_valid = true;

                // Basic required and field being empty
                if (required === '1' && !att_value && validated) {
                    att_valid = false;
                    validated = false;
                    attObj.setInvalid('This field is required');
                    return true; // continue $.each iteration
                } else if (!att_value) {
                    return true; //continue $.each iteration
                }

                // If there's validation, let's do it
                if (validate.length) {

                    validate = USL_Modal._stringToObject(validate);

                    $.each(validate, function (type, value) {

                        var regEx,
                            url_pattern = '[(http(s)?):\\/\\/(www\\.)?a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b' +
                                '([-a-zA-Z0-9@:%_\\+.~#?&//=]*)',
                            email_pattern = '\\b[\\w\\.-]+@[\\w\\.-]+\\.\\w{2,4}\\b';


                        // Validate for many different types
                        switch (type) {

                            // Url validation
                            case 'url':
                                regEx = new RegExp(url_pattern, 'ig');

                                if (!att_value.match(regEx)) {
                                    att_valid = false;
                                    validated = false;
                                    attObj.setInvalid('Please enter a valid URL');
                                }
                                break;

                            // Email validation
                            case 'email':

                                regEx = new RegExp(email_pattern, 'ig');

                                if (!att_value.match(regEx)) {
                                    att_valid = false;
                                    validated = false;
                                    attObj.setInvalid('Please enter a valid Email');
                                }
                                break;

                            // Maximum character count
                            case 'maxchar':

                                if (att_value.length > parseInt(value)) {

                                    att_valid = false;
                                    validated = false;
                                    attObj.setInvalid((att_value.length - parseInt(value)) + ' too many characters.');
                                }
                                break;

                            // Minimum character count
                            case 'minchar':

                                if (att_value.length < parseInt(value)) {

                                    att_valid = false;
                                    validated = false;
                                    attObj.setInvalid((parseInt(value)) - att_value.length + ' too few characters.');
                                }
                                break;

                            // No numbers allowed
                            case 'charonly':

                                if (att_value.match(/[0-9]/)) {
                                    att_valid = false;
                                    validated = false;
                                    attObj.setInvalid('No numbers please');
                                }
                                break;

                            // Only numbers allowed
                            case 'intonly':

                                var numbers = att_value.match(/[0-9]+/);

                                if (!numbers || (numbers[0] !== numbers.input)) {
                                    att_valid = false;
                                    validated = false;
                                    attObj.setInvalid('Only numbers please');
                                }
                                break;

                            // If no matches, throw error
                            default:
                                throw new Error('USL: Unsupported validation method "' + type + '" for the shortcode "' + attObj.shortcode + '" at field "' + attObj.fieldname + '"');
                        }
                    });
                }

                if (att_valid) {
                    attObj.setValid();
                }
            });

            return validated;
        },

        sanitize: function () {

            elements.active_shortcode.find('.usl-modal-att-row').each(function () {

                var attObj = $(this).data('attObj');

                // Skip if no attObj
                if (!attObj) {
                    return true; // Continue $.each
                }

                var sanitize = USL_Modal._stringToObject($(this).attr('data-sanitize')),
                    att_value = attObj.getValue();

                if (sanitize && att_value !== null && att_value.length) {
                    $.each(sanitize, function (type, value) {

                        switch (type) {
                            case 'url':
                                if (!att_value.match(/https?:\/\//)) {
                                    attObj.setValue('http://' + att_value);
                                }
                                break;

                            // If no matches, throw an error
                            default:
                                throw new Error('USL -> Unsupported sanitation method "' + type + '" for the shortcode "' + attObj.shortcode + '" at field "' + attObj.fieldname + '"');

                        }
                    });
                }
            });
        },

        refresh: function () {

            if (elements.active_shortcode) {

                elements.active_shortcode.find('.usl-modal-att-row').each(function () {

                    var attObj = $(this).data('attObj');

                    if (typeof attObj !== 'undefined') {
                        attObj._revert();
                    }
                });
            }
        },

        _stringToObject: function (string) {

            if (typeof string === 'undefined' || !string.length) {
                return false;
            }
            string = '"' + string.replace(/(:|,)/g, '"' + "$1" + '"') + '"';
            string = JSON.parse('{' + string + '}');
            return string;
        }
    };

    function AttAPI() {

        this.name = null;
        this.original_value = null;
        this.fieldname = null;
        this.shortcode = null;
        this.$container = null;
        this.$input = null;

        this.init = function ($e) {

            this.$container = $e;
            this.$input = this.$container.find('.usl-modal-att-input');
            this.name = $e.attr('data-att-name');
            this.fieldname = this.$container.find('.usl-modal-att-name').text().trim();
            this.shortcode = this.$container.closest('.usl-modal-shortcode').attr('data-code');
            this.disabled = this.$container.attr('data-disabled') ? true : false;

            this.storeOriginalValue();
        };

        this.storeOriginalValue = function () {
            this.original_value = this.$input.val();
        };

        this._revert = function () {

            this.revert();
            this.setValid();
            this.$input.prop('disabled', false);

        };

        this.revert = function () {
            this.setValue(this.original_value);
        };

        this.getValue = function () {
            return this.$input.val();
        };

        this.setValue = function (value) {
            this.$input.val(usl_decode_attr(value));
        };

        this.setInvalid = function (msg) {

            this.$container.addClass('invalid');
            this.errorMsg(msg);
            highlight(this.$input);
        };

        this.setValid = function () {
            this.$container.removeClass('invalid');
        };

        this.errorMsg = function (msg) {

            if (typeof this.$errormsg === 'undefined') {
                this.$errormsg = this.$container.find('.usl-modal-att-errormsg');
            }

            this.$errormsg.html(msg);
        };

        this.destroy = function () {
        };
    }

    var Textbox = function ($e) {

        // Extends the AttAPI object
        AttAPI.apply(this, arguments);

        this.getValue = function () {
            if (this.$input.prop('tagName') === 'textarea') {
                return this.$input.text();
            } else {
                return this.$input.val();
            }
        };

        this.init($e);
    };

    var Selectbox = function ($e) {

        // Extends the AttAPI object
        AttAPI.apply(this, arguments);

        this.setValue = function (value) {
            this.$input.val(usl_decode_attr(value));
            this.$input.trigger('chosen:updated');
        };

        this.destroy = function () {
            this.$input.removeData('chosen');
            this.$input.show();
            this.$input.siblings('.chosen-container').remove();
        };

        this.init($e);
    };

    var Colorpicker = function ($e) {

        // Extends the AttAPI object
        AttAPI.apply(this, arguments);

        this.revert = function () {
            this.setValue(this.original_value);
        };

        this.setValue = function (value) {
            this.$input.iris('color', value);
        };

        this.destroy = function () {

            this.$input.removeData('wpWpColorPicker');
            this.$input.removeData('a8cIris');
            this.$container.find('.wp-picker-container').remove();
            this.$container.find('.usl-modal-att-field').prepend(this.$input);
        };

        this.init($e);
    };

    var Slider = function ($e) {

        // Extends the AttAPI object
        AttAPI.apply(this, arguments);

        this.revert = function () {
            this.setValue(this.original_value);
        };

        this.setValue = function (value) {
            this.$input.val(value);
            this.$input.change();
        };

        this.destroy = function () {
            var $slider = this.$container.find('.usl-modal-att-slider');
            $slider.slider('destroy');
            $slider.removeData();
        };

        this.init($e);
    };

    var Counter = function ($e) {

        // Extends the AttAPI object
        AttAPI.apply(this, arguments);

        this.getValue = function () {

            var value = this.$input.val(),
                unit = this.$container.find('.usl-modal-counter-unit select').val();

            if (unit) {
                value += unit;
            }

            return value;
        };

        this.setValue = function (value) {

            // Divide value from units
            var values = value.split(/(\d+)/).filter(Boolean);
            value = values[0]; // The number

            // Make sure the "+" and "-" buttons have the right classes
            var min = this.$input.attr('data-min'),
                max = this.$input.attr('data-max');

            if (value == min) {
                this.$input.siblings('.usl-modal-counter-down').addClass('disabled');
            } else {
                this.$input.siblings('.usl-modal-counter-down').removeClass('disabled');
            }

            if (value == max) {
                this.$input.siblings('.usl-modal-counter-up').addClass('disabled');
            } else {
                this.$input.siblings('.usl-modal-counter-up').removeClass('disabled');
            }

            this.$input.val(value);

            // If a unit was found
            if (values.length > 1) {
                this.$container.find('.usl-modal-counter-unit-input').val(values[1]); // The unit
            }
        };

        this.init($e);
    };

    var Repeater = function ($e) {

        // Extends the AttAPI object
        AttAPI.apply(this, arguments);

        this.revert = function () {
            this.$container.find('.usl-modal-repeater-field').each(function () {
                if ($(this).index() > 1) {
                    $(this).remove();
                }
            });
        };

        this.getValue = function () {

            var values = {};

            this.$container.find('.usl-modal-att-row').each(function () {

                // Skip dummy field
                if ($(this).closest('.usl-modal-repeater-field').hasClass('dummy-field')) {
                    return true; // Continue $.each
                }

                var attObj = $(this).data('attObj');

                if (values[attObj.name]) {
                    // Att already set, append new value
                    values[attObj.name] += '::sep::' + usl_encode_attr(attObj.getValue());
                } else {
                    values[attObj.name] = usl_encode_attr(attObj.getValue());
                }
            });

            return JSON.stringify(values);
        };

        this.setValue = function (object) {

            var self = this;

            if (object.length) {

                // Turn our string literal into an object
                object = JSON.parse(object);

                // Construct the fields object
                var fields = [];
                $.each(object, function (name, values) {

                    var att_values = values.split('::sep::');

                    for (var i = 0; i < att_values.length; i++) {

                        if (!fields[i]) {
                            fields[i] = {};
                        }

                        fields[i][name] = att_values[i];
                    }
                });

                // Add as many new fields as necessary
                for (var i = 1; i < fields.length; i++) {

                    // Fire clicking the "+" button manually in order to create all the fields
                    this.$container.find('.usl-modal-repeater-field:eq(1)').find('.usl-modal-repeater-add').click();
                }

                // Rebuild the new atts attObj data
                USL_Modal.initAtts();

                // Set the values
                for (i = 0; i < fields.length; i++) {

                    $.each(fields[i], function (name, value) {
                        var attObj = self.$container.find('.usl-modal-repeater-field:eq(' + ( i + 1 ) + ')').
                            find('.usl-modal-att-row[data-att-name="' + name + '"]').data('attObj');

                        attObj.setValue(value);
                    });
                }
            }
        };

        this.init($e);
    };

    $(function () {
        USL_Modal.init();
    });

    $(window).load(function () {
        USL_Modal.load();
    });

    $(window).resize(function () {
        USL_Modal.resize();
    });

    // Helper functions
    function initRepeaterButtons($e) {

        var $container = $e.find('.usl-modal-att-field');

        // Add a new field after on pressing the "+"
        $container.find('.usl-modal-repeater-add').off().click(function () {

            // Clone the dummy field in after the current field
            var $clone = $(this).closest('.usl-modal-att-field').find('.usl-modal-repeater-field.dummy-field').clone();

            // Modify the clone
            $clone.show();
            $clone.find('.usl-modal-att-row').removeAttr('data-no-init');
            $clone.removeClass('dummy-field');

            $(this).closest('.usl-modal-repeater-field').after($clone);

            // Re-build the attObj data for the newly cloned atts
            USL_Modal.initAtts();

            // Re-attach button handlers
            initRepeaterButtons($e);
        });

        // Delete the field on pressing the "-"
        $container.find('.usl-modal-repeater-remove').off().click(function () {

            var $field = $(this).closest('.usl-modal-repeater-field');

            // If we're on the second (first visible) field and they're are no more (visible) fields besides this one
            if ($field.index() == 1 && $(this).closest('.usl-modal-att-row').find('.usl-modal-repeater-field').length <= 2) {

                // Clear the inputs
                highlight($field);
                $field.find('.usl-modal-att-row').each(function () {
                    var attObj = $(this).data('attObj');
                    attObj.revert();
                });
            } else {

                // Remove the field
                highlight($field);
                $field.effect('drop', {
                    duration: 300,
                    complete: function () {
                        $(this).remove();
                    }
                });
            }
        });
    }

    function highlight($e, color, font_color, transition) {

        color = typeof color !== 'undefined' ? color : error_color;
        font_color = typeof font_color !== 'undefined' ? font_color : '#fff';
        transition = typeof transition !== 'undefined' ? transition : 300;

        // Get and store the original color
        var orig_colors = {};
        if ($e.data('highlightOriginalColors')) {
            orig_colors = $e.data('highlightOriginalColors');
        } else {
            orig_colors.background = $e.css('backgroundColor');
            orig_colors.font = $e.css('color');
            $e.data('highlightOriginalColors', orig_colors);
        }

        // Animate the color
        $e.css({
            backgroundColor: color,
            color: font_color
        }).stop().animate({
            backgroundColor: orig_colors.background,
            color: orig_colors.font
        }, {
            duration: transition,
            complete: function () {
                $(this).removeAttr('style');
            }
        });
    }

    function chosen_custom_input($chosen) {

        // When hiding the dropdown (submitting the field), use our custom input
        $chosen.on('chosen:hiding_dropdown', function () {

            var name = $(this).attr('name'),
                $self = $(this),
                $container = $chosen.siblings('.chosen-container'),
                custom_val = $container.find('.chosen-search input[type="text"]').val(),
                $placeholder = $container.find('.chosen-single'),
                $custom_input = $container.parent().find('.chosen-custom-input');

            // An existing value has been selected manually or there was no input
            if (!custom_val.length) {
                if ($custom_input.length) {
                    $custom_input.remove();
                }
                return;
            }

            // See if value exists in selectbox, and if it does, set chosen to that value
            var exists = false;
            $(this).find('option').each(function () {
                if ($(this).val() == custom_val) {
                    $self.val(custom_val).trigger('chosen:updated');
                    exists = true;
                    return false;
                }
            });

            if (exists) {
                return;
            }

            if (!$custom_input.length) {
                $container.parent().append('<input type="hidden" class="chosen-custom-input" name="' + name + '" />');
                $custom_input = $container.parent().find('.chosen-custom-input');
            }

            $custom_input.val(custom_val);
            $placeholder.removeClass('chosen-default');
            $placeholder.find('> span').html(custom_val);
        });
    }

    window['usl_encode_attr'] = function (attr, allowed) {

        allowed = typeof allowed !== 'undefined' ? allowed : [];

        return $('<div/>').text(attr.replace(/'|"|\n/g, function (match) {
            match = match == '\'' && allowed.indexOf('\'') === -1 ? '::squot::' : match;
            match = match == '"' && allowed.indexOf('"') === -1 ? '::dquot::' : match;
            match = match == '\n' && allowed.indexOf('\n') === -1 ? '::br::' : match;
            return match;
        })).html();
    };

    window['usl_decode_attr'] = function (attr, ignore) {

        attr = typeof attr !== 'undefined' ? attr : '';
        ignore = typeof ignore !== 'undefined' ? ignore : [];

        return $('<div/>').text(attr.replace(/(::squot::)|(::dquot::)|(::br::)/g, function (match) {
            match = match == '::squot::' && ignore.indexOf('::squot::') === -1 ? '\'' : match;
            match = match == '::dquot::' && ignore.indexOf('::dquot::') === -1 ? '"' : match;
            match = match == '::br::' && ignore.indexOf('::br::') === -1 ? '\n' : match;
            return match;
        })).html();
    };
})(jQuery);