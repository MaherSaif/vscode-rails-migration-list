'use strict';
var vscode = require('vscode');
var path = require('path');

var RailsHelper = (function () {
    function RailsHelper() {
        this.items = [];
        this.migrations_path = path.join(vscode.workspace.rootPath, 'db/migrate')
        this.patterns = ['db/migrate/*'];
    }

    RailsHelper.prototype.generateList = function (arr) {
        var cur = arr.pop();
        var _self = this;

        vscode.workspace.findFiles(cur.toString(), null).then(function (res) {
            res.forEach(function (i) {
                var file_path = vscode.workspace.asRelativePath(i);
                var file_name = file_path.replace(/db\/migrate\/[0-9]{14}_(.*)\.rb/, '$1');

                _self.items.push(file_name);
            });
            if (arr.length > 0) {
                _self.generateList(arr);
            }
            else {
                _self.showQuickPick(_self.items.reverse());
            }
        });
    };
    RailsHelper.prototype.showQuickPick = function (items) {
        var _self = this;

        var p = vscode.window.showQuickPick(items, {
            placeHolder: "Select File",
            matchOnDetail: true
        });
        p.then(function (value) {
            if (!value)
                return;
            var fn = vscode.Uri.parse('file://' + path.join(_self.migrations_path, value));
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
