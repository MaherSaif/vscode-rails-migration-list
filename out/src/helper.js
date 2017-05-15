'use strict';
var vscode = require('vscode');
var path = require('path');

var RailsHelper = (function () {
    function RailsHelper(migrations_path) {
        this.items = [];
        this.patterns = ['db/migrate/*'];
    }

    RailsHelper.prototype.generateList = function (arr) {
        var cur = arr.pop();
        var _self = this;

        vscode.workspace.findFiles(cur.toString(), null).then(function (res) {
            res.forEach(function (i) {
                var fn = vscode.workspace.asRelativePath(i);
                _self.items.push(fn);
            });
            if (arr.length > 0) {
                _self.generateList(arr);
            }
            else {
                _self.showQuickPick(_self.items);
            }
        });
    };
    RailsHelper.prototype.showQuickPick = function (items) {
        var p = vscode.window.showQuickPick(items, {
            placeHolder: "Select File",
            matchOnDetail: true
        });
        p.then(function (value) {
            if (!value)
                return;
            var fn = vscode.Uri.parse('file://' + path.join(vscode.workspace.rootPath, value));
            vscode.workspace.openTextDocument(fn).then(function (doc) {
                return vscode.window.showTextDocument(doc);
            });
        });
    };
    RailsHelper.prototype.showFileList = function () {
        this.generateList(this.patterns);
    };
    return RailsHelper;
}());
exports.RailsHelper = RailsHelper;
