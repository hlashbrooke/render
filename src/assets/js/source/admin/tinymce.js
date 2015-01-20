/**
 * Adds the tinymce button.
 *
 * @since 1.0.0
 *
 * @global tinymce
 * @global Render_Modal
 * @global Render_Data
 * @global Render_MCECallbacks
 *
 * @package Render
 * @subpackage Modal
 */
var Render_tinymce;
(function ($) {
    var editor, $texteditor, $editor, $loader,
        min_load_time = false,
        last_message = 0,
        submitted = false,
        $lastNode = '';

    Render_tinymce = {

        init: function () {

            // TODO Shortcode drag and drop

            this.addToTinymce();
            this.binds();

            $editor = $('#wp-content-editor-container');
            $texteditor = $editor.find('.wp-editor-area');

            this.createLoader();
        },

        binds: function () {

            $(document).on('render-modal-close', function () {
                Render_tinymce.close();
            });

            $(document).on('render-modal-update', function () {
                Render_tinymce.update();
            });

            $(document).on('render-modal-remove', function () {
                Render_tinymce.removeShortcode();
            });

            $(document).on('render-tinymce-post-render', function () {
                Render_tinymce.postRender();
            });

            $('#post').submit(function (event) {
                Render_tinymce.submit(event, $(this));
            });
        },

        editorBinds: function ($body) {

            $body.on('mouseover', '.render-tinymce-shortcode-wrapper', function (e) {

                e.stopPropagation();

                // Remove all other active tooltips
                $body.find('.render-tinymce-shortcode-wrapper-actions.active').removeClass('active');

                // Add to new tooltip
                $(this).find('> .render-tinymce-shortcode-wrapper-actions').addClass('active');
            });

            $body.on('mouseleave', '.render-tinymce-shortcode-wrapper', function (e) {

                e.stopPropagation();

                // Remove all other active tooltips
                $body.find('.render-tinymce-shortcode-wrapper-actions.active').removeClass('active');
            })
        },

        addToTinymce: function () {

            tinymce.PluginManager.add('render', function (_editor) {

                // Set the active editor
                editor = _editor;

                // Fires when clicking the shortcode <> button in the tinymce toolbar
                _editor.addCommand('Render_Open', function () {

                    Render_Modal.selection = editor.selection.getContent();
                    Render_tinymce.open();
                });

                // Refresh the editor
                _editor.addCommand('Render_Refresh', function () {
                    Render_tinymce.loadVisual();
                });

                _editor.addButton('render_open', {

                    // Establishes an icon class for the button with the prefix "mce-i-"
                    icon: 'render-mce-icon',
                    cmd: 'Render_Open',
                    tooltip: 'Add Shortcode',

                    // Make the shortcode have class "active" when cursor is inside it
                    // REMOVE if still not in use
                    //onPostRender: function () {
                    //    editor.on('nodechange', function (event) {
                    //
                    //        var $node = $(event.element).hasClass('render-tinymce-shortcode-wrapper') ?
                    //                $(event.element) :
                    //                $(event.element).closest('.render-tinymce-shortcode-wrapper'),
                    //            is_render = $node.length ? true : false;
                    //
                    //        if ($lastNode.length) {
                    //            $lastNode.removeClass('active');
                    //        }
                    //
                    //        if (is_render) {
                    //            $lastNode = $node;
                    //            $lastNode.addClass('active');
                    //        }
                    //    });
                    //}
                });

                _editor.addButton('render_refresh', {

                    // Establishes an icon class for the button with the prefix "mce-i-"
                    icon: 'render-mce-refresh-icon',
                    cmd: 'Render_Refresh',
                    tooltip: 'Refresh Editor'
                });

                // WP default shortcut
                _editor.addShortcut('alt+shift+s', '', 'render-open');

                // Click the editor
                _editor.onClick.add(function (editor, event) {

                    // Remove delete overlay for all shortcodes
                    var $body = $(editor.getBody()),
                        $shortcode, content, container_html, shortcode;

                    $body.find('.render-tinymce-shortcode-wrapper.delete').removeClass('delete');

                    // Edit a shortcode
                    if ($(event.target).hasClass('render-tinymce-shortcode-wrapper-edit')) {

                        $shortcode = $(event.target).closest('.render-tinymce-shortcode-wrapper');
                        content = $shortcode.find('.render-tinymce-shortcode-content').html();
                        container_html = $('<div />').append($shortcode.clone()).html();
                        shortcode = Render_tinymce.visualToLiteral(container_html);

                        if (content && content.length) {
                            Render_Modal.selection = content;
                        }

                        $shortcode.addClass('render-tinymce-editing');

                        Render_tinymce.open(shortcode);
                    }

                    // Remove a shortcode
                    if ($(event.target).hasClass('render-tinymce-shortcode-wrapper-remove')) {

                        $shortcode = $(event.target).closest('.render-tinymce-shortcode-wrapper');
                        editor.dom.remove($shortcode[0]);
                    }
                });

                // Keydown (ANY key) in the editor
                // FIXME Deprecated
                _editor.onKeyDown.add(function (editor, event) {

                    // Backspace
                    if (event.keyCode == 8) {

                        var curElm = editor.selection.getRng().startContainer,
                            range = editor.selection.getBookmark(curElm.textContent).rng,
                            node = editor.selection.getNode(),
                            text = range.startContainer.textContent;

                        if (typeof range === 'undefined') {
                            return;
                        }

                        // If pressing backspace right after a shortcode, delete the entire shortcode
                        var caret_position = range.startOffset,
                            $container = $(range.startContainer),
                            $prev = $(range.startContainer.previousElementSibling);

                        if (!$prev.length) {
                            $prev = $container.prev();
                        }

                        if (!$prev.length) {
                            $prev = $container.parent().prev();
                        }

                        // If we're at the beginning of the current node and the previous node is a shortcode, delete it!
                        if ((caret_position === 0 ||
                            !text.trim().length ||
                            text.charCodeAt(caret_position - 1) === 8203) &&
                            $prev.hasClass('render-tinymce-shortcode-wrapper')
                        ) {

                            if ($prev.hasClass('delete')) {
                                console.log('remove!');
                                $prev.remove();
                            } else {
                                console.log('add');
                                $prev.addClass('delete');
                            }

                            event.preventDefault();
                            return false;
                        }

                        // If there's no more content, delete the shortcode
                        if ($(node).html().length <= 1) {
                            $(node).closest('.render-tinymce-shortcode-wrapper').remove();
                        }

                        // Don't allow backspace at beginning of string (inside shortcodes)
                        if (caret_position === 0 && $(node).hasClass('render-tinymce-shortcode-content')) {
                            event.preventDefault();
                        }
                    } else {

                        // Any other key [besides backspace]

                        // Remove delete overlay for all shortcodes
                        var $body = $(editor.getBody());
                        $body.find('.render-tinymce-shortcode-wrapper.delete').removeClass('delete');
                    }
                });

                // Keypress (printable keys) in the editor
                _editor.onKeyPress.add(function (editor, event) {

                    var node = editor.selection.getNode(),
                        node_content = $(node).html();

                    if (node && !$(node).hasClass('render-tinymce-shortcode-content')) {
                        return;
                    }

                    var curElm = editor.selection.getRng().startContainer,
                        range = editor.selection.getBookmark(curElm.textContent).rng;

                    if (typeof range === 'undefined') {
                        return;
                    }

                    var caretPos = range.startOffset,
                        char_to_delete = caretPos != 0 ? node_content.slice(caretPos - 1, caretPos) : '';

                    // Convert char codes to literal for counting purposes
                    var literal_text = $('<div />').html(node_content).text();

                    // Insert char after string to prevent editing outside the shortcode
                    if (caretPos === literal_text.length) {

                        var newChar = String.fromCharCode(event.charCode);

                        if (newChar === ' ') {
                            newChar = '&nbsp;';
                        }

                        event.preventDefault();
                        $(node).html(literal_text + newChar);
                        editor.selection.select(node, true);
                        editor.selection.collapse(false);
                    }
                });

                _editor.on('init show', Render_tinymce.loadVisual);

                _editor.on('init', function () {
                    Render_tinymce.editorBinds($(editor.getBody()));
                });

                _editor.on('hide', function () {
                    var content = editor.getContent({format: 'numeric'});
                    $texteditor.val(window.switchEditors.pre_wpautop(Render_tinymce.loadText(content)));
                });

                _editor.on('click', function (event) {
                    var x = event.clientX,
                        y = event.clientY,
                        body = editor.getBody(),
                        bodyRect = body.getBoundingClientRect(),
                        first = body.firstChild,
                        firstRect = first.getBoundingClientRect(),
                        last = body.lastChild,
                        lastRect = last.getBoundingClientRect(),
                        view;
                });

                // TODO Do something like this to prevent undo-ing rendering (taken from wpview tinymce plugin)
                // Prevent adding undo levels on changes inside a view wrapper
                //editor.on( 'BeforeAddUndo', function( event ) {
                //    if ( event.lastLevel && emptyViews( event.level.content ) === emptyViews( event.lastLevel.content ) ) {
                //        event.preventDefault();
                //    }
                //});
            });
        },

        createLoader: function () {

            $editor.append('<div id="render-tinymce-loader" class="hide"><div class="spinner"></div><div class="text">></div></div>');
            $loader = $('#render-tinymce-loader');
        },

        /**
         * Renders literal shortcodes into visual shortcodes (Text -> Visual).
         */
        loadVisual: function () {

            if (Render_Data.do_render) {
                var content = editor.getContent();
                Render_MCECallbacks.convertLiteralToRendered(content, editor);
            }
        },

        postRender: function () {

            // Add a divider to any shortcode that's the last item (as it's then impossible to click beyond it)
            var $body = $(editor.getBody());
            $body.find('.render-tinymce-shortcode-wrapper').each(function () {

                // If this element is the last element of it's parent
                if ($(this).parent().contents().last()[0] == $(this)[0]) {
                    $(this).after('<span class="render-tinymce-divider">&#8203;</span>');
                }
            });
        },

        /**
         * Converts rendered shortcodes into literal shortcodes (Visual -> Text).
         */
        loadText: function (content) {

            content = Render_MCECallbacks.convertRenderedToLiteral(content);
            content = content.replace(/<span class="render-tinymce-divider.*?>.*?<\/span>/g, '');
            content = content.replace(/<p class="render-tinymce-divider.*?>.*?<\/p>/g, '');

            return content;
        },

        visualToLiteral: function (shortcode) {

            var code = $(shortcode).attr('data-code'),
                atts = $(shortcode).attr('data-atts'),
                shortcode_content = $(shortcode).find('.render-tinymce-shortcode-content').html();

            var output = '[' + code;

            if (atts) {
                atts = JSON.parse(atts);
                $.each(atts, function (name, value) {
                    if (value.length) {
                        output += ' ' + name + '=\'' + value + '\'';
                    }
                });
            }

            output += ']';

            if (shortcode_content) {
                output += shortcode_content + '[/' + code + ']';
            }

            return output;
        },

        open: function (shortcode) {

            var $modal_shortcodes = $('#render-modal-wrap').find('.render-modal-shortcodes');


            if (typeof shortcode !== 'undefined') {
                $modal_shortcodes.find('.render-modal-shortcode.wrapping.disabled').removeClass('disabled');
                Render_Modal.modify(shortcode);
            } else {

                if (!Render_Modal.selection) {
                    $modal_shortcodes.find('.render-modal-shortcode.wrapping').addClass('disabled');
                } else {
                    $modal_shortcodes.find('.render-modal-shortcode.wrapping.disabled').removeClass('disabled');
                }

                Render_Modal.open();
            }
        },

        close: function () {
            editor.focus();
        },

        update: function () {

            var $shortcode = $(editor.dom.select('.render-tinymce-editing'));

            // Replace or insert the content
            if ($shortcode.length) {
                editor.dom.remove($shortcode.next('.render-tinymce-divider')); // Get rid of the leftover divider!
                $shortcode.replaceWith(Render_Modal.output.all);
            } else {
                editor.insertContent(Render_Modal.output.all);
            }

            // Render the shortcodes
            this.loadVisual();
        },

        removeShortcode: function () {

            var node = editor.selection.getNode(),
                $node = $(node).hasClass('render-tinymce-shortcode-wrapper') ?
                    $(node) :
                    $(node).closest('.render-tinymce-shortcode-wrapper'),
                $divider = $node.next('.render-tinymce-divider');

            editor.dom.remove($node[0]);
            editor.dom.remove($divider[0]);

            Render_Modal.close();
        },

        loading: function (loading) {

            if (loading) {

                // Makes sure the the loader stays for a minimum time
                min_load_time = true;
                setTimeout(function () {
                    min_load_time = false;
                }, 1500);

                // Get a random loading message
                var loading_messages = Render_Data.loading_messages,
                    random_message = Math.floor(Math.random() * (loading_messages.length));

                // Make sure it's not the same message as last time (that's boring!)
                if (random_message == last_message) {
                    while (random_message == last_message) {
                        random_message = Math.floor(Math.random() * (loading_messages.length))
                    }
                }

                last_message = random_message;

                $loader.find('.text').html(loading_messages[random_message]);
                $loader.removeClass('hide');
                $('#content-html').prop('disabled', true);
                $('#content-tmce').prop('disabled', true);
                $('#wp-content-media-buttons').addClass('disabled');
            } else {
                waitMinimumLoadingTime();
            }

            function waitMinimumLoadingTime() {

                // Don't remove the loader until the minimum load time has passed
                if (min_load_time) {
                    setTimeout(waitMinimumLoadingTime, 50);
                    return;
                }

                $loader.addClass('hide');
                $('#content-html').prop('disabled', false);
                $('#content-tmce').prop('disabled', false);
                $('#wp-content-media-buttons').removeClass('disabled');
            }
        },

        submit: function (event, $e) {

            if (!submitted) {

                submitted = true;

                event.preventDefault();
                var content = editor.getContent();

                editor.on('PostProcess', function (e) {
                    e.content = Render_tinymce.loadText(content);
                });

                $e.submit();
            }
        },

        getEditor: function () {
            return editor;
        }
    };

    $(function () {
        Render_tinymce.init();
    });

    window['RenderRefreshTinyMCE'] = function () {
        Render_tinymce.loadVisual();
    }
})(jQuery);