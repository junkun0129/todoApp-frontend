var Events = {};

(function() { // DOM Events
    /** Types of DOM events
    */
    var _EVENT_TYPES = [
        "blur",
        "change",
        "click",
        "hover",
        "keydown",
        "keypress",
        "keyup",
        "paste",
        "scroll",
        "shown",
        "submit"
    ];

    /** Bind event selectors - automatically bind all eventBindingName events

        Ex: {cool_button: #cool_button} will map Events.clickCoolButton

        This is because of the naming convention of all events: $eventThingName

        {
            binding: <String> // Selector
        }
    */
    Events.bind = function(bindings) {
        $(document).keydown(Events.keydownDocument);

        //Turns name_name_name into NameNameName
        var _camelCase = function(str) {
            var toUpperCase = function(match) { return match.toUpperCase(); };

            return str
                .replace(/(?:^|[\s_])[a-z]/g, toUpperCase)
                .replace(/_/g, "");
        };

        Object.keys(bindings).forEach(function(element) {
            var elementName = _camelCase(element);

            _EVENT_TYPES
            .filter(function hasEventHandlerForElement(eventType) {
                return !!Events[eventType + elementName];
            })
            .forEach(function bindEventHandlerToElementEvent(eventType) {
                var action = Events[eventType + elementName];

                $(bindings[element]).on(eventType, action);
            });
        });
    };

    /** Click on name to toggle account details
    */
    Events.clickAccountButton = function() {
        Page.toggleSettings({});
    };

    /** Click to change the background color
    */
    Events.clickChangeBackground = function(e) {
        Events.stopDefault(e);

        Page.changeBackground({}, Client.reportErrors({}));
    };

    /** Click to remove the window
    */
    Events.clickCloseWindow = function() {
        chrome.app.window.current().close();

        Client.track({path: "window/close"});
    };

    /** Click to confirm trashing the selected note
    */
    Events.clickConfirmTrashNote = function(e) {
        e.stopPropagation();

        Page.removeSelectedNoteListing({}, Client.reportErrors({}));
    };

    /** Click on the error message
    */
    Events.clickErrorMessage = function() {
        Page.resetError({});
    };

    /** Click to adjust font size
    */
    Events.clickFontSize = function(e) {
        Events.stopDefault(e);

        Page.adjustFontSize({
            increase_size: !$(this).is(".smaller")
        },
        Client.reportErrors({}));
    };

    /** Click to select a font style
    */
    Events.clickFontStyle = function() {
        Page.adjustFontStyle({
            style: $(this).data("type")
        },
        Client.reportErrors({}));
    };

    /** Click to force logout
    */
    Events.clickForceLogoutButton = function(e) {
        Events.stopDefault(e);

        Page.logout({}, Client.reportErrors({}));
    };

    /** Click to toggle fullscreen
    */
    Events.clickFullscreenWindow = function() {
        chrome.app.window.current().fullscreen();

        Client.track({path: "window/fullscreen"});
    };

    /** Click to get information about some feature
    */
    Events.clickInfoButton = function(e) {
        Events.stopDefault(e);

        Page.addRemoteSyncInfoNote({
            service: $(this).data("id")+""
        },
        Client.reportErrors({}));
    };

    /** Click button to logout
    */
    Events.clickLogoutButton = function() {
        Client.track({path: "account/logout"});

        Sync.logout({}, Client.reportErrors({}));
    };

    /** Click to toggle window maximization
    */
    Events.clickMaximizeWindow = function(e) {
        var isMaximized = chrome.app.window.current().isMaximized();

        var action = isMaximized ? "restore" : "maximize";

        chrome.app.window.current()[action]();

        Client.track({path: "window/" + action});
    };

    /** Click to minimize the window
    */
    Events.clickMinimizeWindow = function() {
        chrome.app.window.current().minimize();

        Client.track({path: "window/minimize"});
    };

    /** Click new action
    */
    Events.clickNewAction = function() {
        Page.addNewNote({}, Client.reportErrors({}));
    };

    /** Click something in the notes section
    */
    Events.clickNotesSection = function(e) {
        var target = $(e.target);

        if (!target.is("a")) { return; }

        var href = target.attr("href");

        if (!href) { return; }

        window.open(href, "_blank");

        Client.track({path: "note/anchor"});
    };

    /** Click a note in the notes view
    */
    Events.clickNoteStack = function() {
        Page.selectNoteListing({
            clear_selection: true,
            node: $(this)
        },
        Client.reportErrors({}));
    };

    /** Click confirm purchase remote sync

        {
            service: Array<String>
        }
    */
    Events.clickPurchase = function(args) {
        return function(e) {
            e.preventDefault(); e.stopPropagation();

            var serviceType = args.service.join("_");

            Client.track({path: "purchase/" + serviceType + "/confirm"});

            Page.purchase({});
        };
    };

    /** Click purchase premium background
    */
    Events.clickPurchasePremiumBackground = function(e) {
        e.preventDefault(); e.stopPropagation();

        Page.purchase({});
    };

    /** Click register button
    */
    Events.clickRegisterButton = function() {
        Page.advanceRegistration({
            register_button: $(this)
        },
        Client.reportErrors({}));
    };

    /** Click remote sync service checkbox

        {
            priv: <String>
            service: Array<String>
        }
    */
    Events.clickRemoteSyncCheckbox = function(args) {
        return function(e) {
            if ($(e.target).is(".info")) { return Events.stopDefault(e); }

            var isEnabled = $(this).closest(".option").is(".on");
            var privs = $("#account").data("cached_privs");

            var hasPriv = _(privs || []).contains(args.priv);

            Page.toggleRemoteSync({
                priv: args.priv,
                service: args.service,
                window: !isEnabled && hasPriv ? window.open() : null
            },
            Client.reportErrors({}));
        };
    };

    /** Click forgot password button
    */
    Events.clickResetPasswordButton = function() {
        Sync.triggerPasswordReset({});
    };

    /** Click on the search action button
    */
    Events.clickSearchAction = function() {
        Page.toggleSearchMode({}, Client.reportErrors({}));
    };

    /** Click to share a note
    */
    Events.clickShareAction = function() {
        Page.presentShareNoteModal({});
    };

    /** On the share modal, click the button to open email app
    */
    Events.clickShareCopyButton = function(e) {
        Events.stopDefault(e);

        Page.shareNoteViaCopy({});
    };

    /** In the share modal, click the button to send a copy via email
    */
    Events.clickShareSendButton = function(e) {
        e.preventDefault();

        Page.shareNoteViaSendButton({button: $(this)});
    };

    /** Click subscribe to plan with credit card

        @data
        {
            product_description: <String> // "short sub heading"
            product_icon: <URL String> // "url_to_150x150_image"
            product_key: <String> // "gtasks"
            product_name: <String> // "title"
            product_price: <Cents String> // "495"
            stripe_key // "$stripe_publish_key"
        }
    */
    Events.clickSubscribeButton = function(e) {
        e.preventDefault();

        var purchaseButton = $(this);

        if (!!purchaseButton.data("loading_stripe")) { return; }

        purchaseButton.button("reset");

        purchaseButton.data("loading_stripe", 1);

        Sync.getAuthenticatingEmailAddress({}, function(err, email) {
            if (!!err || !window.StripeCheckout) {
                purchaseButton.button("error");

                purchaseButton.data("loading_stripe", 0);

                return Client.log({err: err});
            }

            Page.purchaseSubscription({
                email: email,
                product_description: purchaseButton.data().product_description,
                product_icon: purchaseButton.data().product_icon,
                product_key: purchaseButton.data().product_key,
                product_name: purchaseButton.data().product_name,
                product_price: purchaseButton.data().product_price,
                purchase_button: purchaseButton,
                stripe_key: purchaseButton.data().stripe_key
            });
        });
    };

    /** Click trash note action button
    */
    Events.clickTrashAction = function() {
        Page.showTrashConfirmationForSelectedNote({});
    };

    /** Hover over the notes section
    */
    Events.hoverNotesSection = function(e) {
        var target = $(e.target);

        if (!target.is("a")) { return; }

        target.css("cursor", "pointer");
    };

    /** Initialize events

        {}
    */
    Events.init = function(args, cbk) {
        async.auto({
            bindStandardEvents: function(go_on) {
                Events.bind({
                    account_button: "#email",
                    auth_section: "#account",
                    close_window: "#title_bar .remove",
                    change_background: "#user .change_background",
                    error_message: "#account .error_message label",
                    font_size: "#user .change_size",
                    font_style: "#style li",
                    force_logout_button: "#account .force_logout",
                    fullscreen_window: "#title_bar .fullscreen",
                    info_button: "#account .info",
                    logout_button: "#account .logout",
                    maximize_window: "#title_bar .maximize",
                    minimize_window: "#title_bar .minimize",
                    new_action: "#action_new",
                    notes_section: "#notes",
                    purchase_premium_background: "#premium_background",
                    register_button: "#account #account_register",
                    reset_password_button: ".reset_password",
                    search_action: "#action_search",
                    search_section: "#search",
                    share_action: "#action_share",
                    share_copy_button: "#share .copy",
                    share_message_section: "#share .message",
                    share_section: "#share",
                    share_send_button: "#share .send",
                    subscribe_button: "#premium .btn-primary",
                    trash_action: "#action_trash",
                    type_action: "#action_type"
                });

                go_on();
            },

            trackChromeAppBlur: function(go_on) {
                if (!Client.isChromeApp()) { return go_on(); }

                chrome.app.window.current().contentWindow
                    .addEventListener("blur", Events.visibleDocument, false);

                go_on();
            },

            trackRemoteSyncClick: function(go_on) {
                [["google", "drive"], ["dropbox"]].forEach(function(service) {
                    var priv = null;

                    if (service.join(" ") === "google drive") {
                        priv = "gdrive";
                    }
                    else {
                        priv = service[0];
                    }

                    var clickPurchase = Events.clickPurchase({
                        service: service
                    });

                    var clickSync = Events.clickRemoteSyncCheckbox({
                        priv: priv,
                        service: service
                    });

                    $("#sync ." + service.join("_")).click(clickSync);

                    $("#sync ." + service.join("_") + " .purchase")
                        .click(clickPurchase);
                });

                go_on();
            },

            trackStorage: function(go_on) {
                $(window).on("storage", Events.receiveStorageUpdate);

                go_on();
            },

            trackVisibility: function(go_on) {
                ["visibilitychange", "webkitvisibilitychange"]
                    .forEach(function(event) {
                        document.addEventListener(
                            event,
                            Events.visibleDocument,
                            false
                        );
                    });

                return go_on();
            },

            trackWindowResize: function(go_on) {
                $(window).resize(Events.resizeWindow);

                go_on();
            }
        },
        cbk);
    };

    /** Key press up in document
    */
    Events.keydownDocument = function(e) {
        if (!e.which) { return; }

        if (e.which === 9 && $(e.target).is("#notes")) {
            var selection = window.getSelection();

            if (!selection || selection.type != "Caret") { return; }

            var range = selection.getRangeAt(0);
            var space = document.createTextNode("\u2003\u2003");

            range.deleteContents();

            range.insertNode(space);

            range.setStartAfter(space);

            range.setEndAfter(space);

            range.collapse(false);

            selection.removeAllRanges();

            selection.addRange(range);

            return Events.stopDefault(e);
        }

        if (!e.ctrlKey) { return; }

        var c = String.fromCharCode(e.which);

        if (c === "N") {
            return Page.addNewNote({}, Client.reportErrors({}));
        }
    };

    /** Key press in notes section
    */
    Events.keydownNotesSection = function(e) {
        // No need to stop empty strings from being added
        if (!!e.ctrlKey ||
            !!e.metaKey ||
            !String.fromCharCode(e.which).length)
        {
            return true;
        }

        var noteText = Page.getNoteText({});

        var m = encodeURIComponent(noteText).match(/%[89ABab]/g);

        var noteLength = noteText.length + (m ? m.length : 0);

        // No need to stop small notes from being expanded
        if (noteLength < Data.MAX_NOTE_LENGTH) { return true; }

        Events.stopDefault(e);

        Page.showError({err: {status: "note_too_long"}});
    };

    /** Append a new line when there is a keypress on notes section
    */
    Events.keypressNotesSection = function(e) {
        if (e.which !== 13 || !window.getSelection) { return null; }

        var br = document.createElement("br");
        var selection = window.getSelection();

        var range = selection.getRangeAt(0)

        range.deleteContents();

        range.insertNode(br);

        var div = document.createElement("div");

        range.insertNode(div);

        range.setStartAfter(br);

        range.setEndAfter(br);

        range.collapse(false);

        selection.removeAllRanges();

        selection.addRange(range);

        var cursorPosition = $(div).position().top;
        var notesHeight = $("#notes").height();
        var scrollTop = $('#notes').scrollTop();

        var bottomDistance = notesHeight - cursorPosition;
        var visibleDistance = cursorPosition - notesHeight + scrollTop + 15;

        // Scroll down if necessary
        if (visibleDistance && bottomDistance < 20) {
            $("#notes").animate({scrollTop: visibleDistance}, 50);
        }

        $(div).remove();

        return false;
    };

    /** Typing in notes section
    */
    Events.keyupNotesSection = function() {
        clearTimeout(Client.saveTyping);

        $("#notes").data("last_typing", new Date().toISOString());

        var noteText = Page.getNoteText({});
        var selectedStack = $("#stacks .selected");

        selectedStack
            .toggleClass("empty", noteText === "")
            .find(".title").text(Page.titleFromNoteText({text: noteText}));

        $("#stacks .confirm").removeClass("appear");

        Client.saveTyping = setTimeout(function() {
            Page.save({}, Client.reportErrors({}));

            clearTimeout(Client.saveTyping);
        },
        Client.SAVE_TYPING_TIMEOUT_MS);

        var lastChild = this.lastChild;

        if (!lastChild || lastChild.nodeName.toLowerCase() !== "br") {
            $(this).append($("<br>"));
        }
    };

    /** Key pressed up in the search section
    */
    Events.keyupSearchSection = function() {
        Page.searchNotes({q: $("#search input").val()}, function(err) {
            if (!!err) { return Client.log({err: err}); }
        });
    };

    /** Add an empty line when done typing in notes section
    */
    Events.mouseupNotesSection = function() {
        var lastChild = this.lastChild;

        if (!lastChild || lastChild.nodeName.toLowerCase() !== "br") {
            $(this).append($("<br>"));
        }
    };

    /** Received a new sync activity event from socket

        {
            type: <String>
        }
    */
    Events.notifySyncActivity = function(args) {
        return function() {
            setTimeout(function() {
                Sync.refresh({
                    avoid_forced_refresh: true,
                    type: args.type
                },
                Client.reportErrors({}));
            },
            1000);
        };
    };

    /** Pasting in notes section
    */
    Events.pasteNotesSection = function(e) {
        e.preventDefault();

        $("#notes").data("last_typing", new Date().toISOString());

        var pasted = e.originalEvent.clipboardData.getData("Text");

        var noteText = Page.getNoteText({}) + pasted;

        var m = encodeURIComponent(noteText).match(/%[89ABab]/g);

        var noteLength = noteText.length + (m ? m.length : 0);

        // Stop notes from getting too long
        if (noteLength >= Data.MAX_NOTE_LENGTH) {
            return Page.showError({err: {status: "note_too_long"}});
        }

        var text = pasted.split("\n");

        var selection = window.getSelection();

        var range = selection.getRangeAt(0);

        range.deleteContents();

        var div = document.createElement("div");

        range.insertNode(div);

        text.forEach(function(t, i) {
            var br = null;
            var textNode = document.createTextNode(t);

            if (text.length > 1) {
                br = document.createElement("br");

                range.insertNode(br);
            }

            range.insertNode(textNode);

            range.setStartAfter(br || textNode);

            range.setEndAfter(br || textNode);

            range.collapse(false);

            selection.removeAllRanges();

            selection.addRange(range);
        });

        // Scroll down if necessary
        var cursorPosition = $(div).position().top;
        var notesHeight = $("#notes").height();
        var scrollTop = $("#notes").scrollTop();

        var bottomDistance = notesHeight - cursorPosition;
        var visibleDistance = cursorPosition - notesHeight + scrollTop + 15;

        if (visibleDistance && bottomDistance < 20) {
            $("#notes").animate({scrollTop: visibleDistance}, 50);
        }

        $(div).remove();

        Page.save({}, Client.reportErrors({}));
    };

    /** Get an error from pusher
    */
    Events.receivePusherError = function(err) {
        Sync.processPusherError({err: err});
    };

    /** Get an update from storage
    */
    Events.receiveStorageUpdate = function(e) {
        if (!e.originalEvent || !e.originalEvent.key) { return; }

        async.auto({
            updateLocalToken: function(go_on) {
                Sync.updateLocalToken({
                    key: e.originalEvent.key,
                    value: localStorage[e.originalEvent.key]
                },
                go_on);
            },

            hasAuth: ["updateLocalToken", function(go_on, res) {
                Sync.hasSavedAuth({}, go_on);
            }],

            logoutIfNecessary: ["hasAuth", function(go_on, res) {
                if (e.originalEvent.key !== "authBlock") { return go_on(); }

                if ($("#user").hasClass("authorizing")) { return go_on(); }

                var showsAuthorized = $("#user").hasClass("authorized");

                if (showsAuthorized && !res.hasAuth) {
                    return Page.logout({only_update_dom: true}, go_on);
                }

                go_on();
            }],

            updateVisibleElements: ["logoutIfNecessary", function(go_on, res) {
                Page.updateVisibleElements({}, go_on);
            }]
        },
        Client.reportErrors({}));
    };

    /** Set the size of the window on change
    */
    Events.resizeWindow = function() {
        Page.adjustSizeToWindowHeight({});
    };

    /** Share modal message scroll
    */
    Events.scrollShareMessageSection = function() {
        $(this).css("background-position-y", -4 - $(this).scrollTop());
    };

    /** Scrolled in notes section
    */
    Events.scrollNotesSection = function() {
        $('#paper').css("background-position-y", -3 - $('#notes').scrollTop());
    };

    /** Share modal is shown
    */
    Events.shownShareSection = function() {
        $("#share .emails").focus();
    };

    /** Prevent default event action
    */
    Events.stopDefault = function(e) {
        e.preventDefault();
    };

    /** Submit the authentication form
    */
    Events.submitAuthSection = function(e) {
        e.preventDefault(); e.stopPropagation();

        Page.authenticate({});
    };

    /** Submit the search section
    */
    Events.submitSearchSection = function(e) {
        Events.stopDefault(e);
    };

    /** Change in visibility of document
    */
    Events.visibleDocument = function() {
        if (!!document.hidden || !!document.webkitHidden) {
            return Page.save({}, Client.reportErrors({}));
        }

        async.auto({
            hasAuth: function(go_on) {
                Sync.hasSavedAuth({}, go_on);
            },

            refresh: ["hasAuth", function(go_on, res) {
                if (!res.hasAuth) { return go_on(); }

                Sync.refresh({avoid_forced_refresh: true}, go_on);
            }],

            updateVisible: ["hasAuth", function(go_on) {
                Page.updateVisibleElements({}, go_on);
            }]
        },
        Client.reportErrors({}));
    };
})();

