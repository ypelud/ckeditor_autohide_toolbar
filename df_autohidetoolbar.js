/**
* CkEditor auto hide toolbar plugin
* 
* @version 0.0.1
*
* @author Vianney Riotte
* @author Pelud Yann-Cyril
*
* @link http://cegid.fr
*
*/
(function () {

    var getPos = function (owner) {
        if (owner == undefined) {
            return { top: 0, left: 0, width: 0, height: 0 };
        }

        var e = owner;
        var oTop = e.offsetTop;
        var oLeft = e.offsetLeft;
        var oWidth = e.offsetWidth;
        var oHeight = e.offsetHeight;
        while (e = e.offsetParent) {
            oTop += e.offsetTop;
            oLeft += e.offsetLeft;
        }

        return {
            top: oTop,
            left: oLeft,
            width: oWidth,
            height: oHeight
        }
    }

    var CKAutoHideTB = {
        editor: null,
        wrapper: null,
        upperBox: true,
        AllowHide: true,
        topShift: 10,
        win: CKEDITOR.document.getWindow(),

        initEditor: function (event) {
            //to force the current editor for multiple editor 
            if (event && event.editor && CKAutoHideTB.editor != event.editor) {
                CKAutoHideTB.editor = event.editor;
                CKAutoHideTB.wrapper = document.getElementById('cke_top_' + CKAutoHideTB.editor.name);
            }
        },

        show: function (event) {
            var allInstances = CKEDITOR.instances;
            for (var i in allInstances) {
                editor = allInstances[i];
                editor.fire("forceHide");
            }
            CKAutoHideTB.initEditor(event);
            CKAutoHideTB.toogle(true);
        },

        dataReady: function (event) {
            CKAutoHideTB.initEditor(event);
            CKAutoHideTB.toogle(false);
            if (CKAutoHideTB.editor.document && CKAutoHideTB.editor.config.autohide_focus)
                CKAutoHideTB.editor.document.focus();
        },

        hide: function (event) {
            if (CKAutoHideTB.AllowHide) {
                CKAutoHideTB.initEditor(event);
                CKAutoHideTB.toogle(false);
            }
        },

        resize: function () {
            if (CKAutoHideTB.editor.config.autohidemagic) {
                var pos = getPos(document.getElementById('cke_contents_' + CKAutoHideTB.editor.name));
                if (CKAutoHideTB.wrapper || (CKAutoHideTB.wrapper = document.getElementById('cke_top_' + CKAutoHideTB.editor.name))) {
                    var posX = pos.top - CKAutoHideTB.wrapper.clientHeight - CKAutoHideTB.topShift;
                    var posY = pos.left - 1;
                    CKAutoHideTB.wrapper.style.top = posX + 'px';
                    CKAutoHideTB.wrapper.style.left = posY + 'px';
                    CKAutoHideTB.wrapper.style.backgroundColor = CKAutoHideTB.wrapper.style.backgroundColor;
                    CKAutoHideTB.wrapper.style.border = CKAutoHideTB.wrapper.style.border ;
                }
            }
        },

        forceHide: function (event) {
            CKAutoHideTB.hide(event);
        },

        toogle: function (show) {

            if (!CKAutoHideTB.editor.document) return;

            if (CKAutoHideTB.wrapper || (CKAutoHideTB.wrapper = document.getElementById('cke_top_' + CKAutoHideTB.editor.name))) {

                var children = CKAutoHideTB.wrapper.childNodes;
                var contents = document.getElementById('cke_contents_' + CKAutoHideTB.editor.name);
                var pos = getPos(contents);
                if (show) {
                    if (CKAutoHideTB.editor.config.autohidemagic) {
                        var style = CKAutoHideTB.wrapper.style;
                        CKAutoHideTB.wrapper.style.zindex = 10000;
                        CKAutoHideTB.wrapper.style.position = "absolute";
                        var width = pos.width - 1;
                        CKAutoHideTB.wrapper.style.width = width + 'px';
                    }
                    CKAutoHideTB.wrapper.style.display = '';
                    if (CKAutoHideTB.editor.config.autohidemagic) {
                        CKAutoHideTB.resize();
                    }
                    CKAutoHideTB.win.on("resize", CKAutoHideTB.resize);
                }
                else {
                    CKAutoHideTB.wrapper.style.display = 'none';
                    CKAutoHideTB.win.removeListener("resize", CKAutoHideTB.resize);
                }
            }
        },

        setListeners: function (editor) {
            editor.on('dataReady', CKAutoHideTB.dataReady);
            editor.on('focus', CKAutoHideTB.show);
            editor.on('blur', CKAutoHideTB.hide);
            editor.on('forceHide', CKAutoHideTB.forceHide);
            CKEDITOR.on('ariaWidget', function (event) {
                if (event.data.$.tagName == "IFRAME") {
                    var iframe = event.data;
                    var focused = CKEDITOR.env.ie ? iframe : new CKEDITOR.dom.window(iframe.$.contentWindow);
                    focused.on("focus", function (event) {
                        CKAutoHideTB.AllowHide = false;
                        CKAutoHideTB.show();
                    });
                    focused.on("blur", function (event) {
                        CKAutoHideTB.AllowHide = true;
                        CKAutoHideTB.hide();
                    });
                }
            });
        }
    };

    CKEDITOR.plugins.add('cdkeditor_autohidetoolbar', {
        init: function (editor) {
            if (editor.config.editingBlock) {
                CKAutoHideTB.setListeners(editor);
            }
        }
    });
})();
