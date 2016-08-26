var exec = require('child_process').exec;

var ppid = exports.ppid = function(pid, cb) {
    pid = pid || process.pid;
    exec('ps hoppid ' + pid, cb);
};

var wid = exports.wid = function(pid, cb) {
    pid = pid || process.pid;
    exec('wmctrl -lp | grep ' + pid + ' | cut -d \' \' -f1', cb);
};

var set_wmclass = exports.set_wmclass = function(wmclass, crawl, pid) {
    crawl = crawl || false;
    pid   = pid  || process.pid;

    /* Debería en realidad ir subiendo en el árbol de procesos hasta encontrar una ventana o el init */
    if(crawl) {
        ppid(pid, function(error, ppid, stderr) {
            wid(ppid, function(error, wid, stderr) {
                exec('xprop -id' + wid + ' -f WM_CLASS 8s -set WM_CLASS ' + wmclass);
            });
        });
    } else {
        wid(pid, function(error, wid, stderr) {
            exec('xprop -id' + wid + ' -f WM_CLASS 8s -set WM_CLASS ' + wmclass);
        });
    }
};
