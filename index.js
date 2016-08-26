var exec = require('child_process').exec;

exports.ppid = function(pid, cb) {
    exec('ps hoppid ' + pid, cb);
};

exports.wid = function(pid, cb) {
    exec('wmctrl -lp | grep ' + pid + ' | cut -d \' \' -f1', cb);
};

exports.setwmclass = function(wmclass, crawl, pid) {
    crawl = crawl || false;
    pid   = proc  || process.pid;

    /* Debería en realidad ir subiendo en el árbol de procesos hasta encontrar una ventana o el init */
    if(crawl) {
        get_ppid(pid, function(error, ppid, stderr) {
            get_wid(ppid, function(error, wid, stderr) {
                exec('xprop -id' + wid + ' -f WM_CLASS 8s -set WM_CLASS ' + wmclass);
            });
        });
    } else {
        get_wid(pid, function(error, wid, stderr) {
            exec('xprop -id' + wid + ' -f WM_CLASS 8s -set WM_CLASS ' + wmclass);
        });
    }
};
