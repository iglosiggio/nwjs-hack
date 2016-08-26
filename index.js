var exec = require('child_process').exec;

var ppid = exports.ppid = function(pid, cb) {
    pid = pid || process.pid;
    exec('ps hoppid ' + pid, function(error, ppid, stderr) {
        cb(error, Number.parseInt(ppid), stderr);
    });
};

var wid = exports.wid = function(pid, cb) {
    pid = pid || process.pid;
    exec('wmctrl -lp | grep ' + pid + ' | cut -d \' \' -f1', function(error, wid, stderr) {
        cb(error, Number.parseInt(wid), stderr);
    });
};

var set_wmclass = exports.set_wmclass = function(wmclass, crawl, pid) {
    crawl = crawl || false;
    pid   = pid  || process.pid;

    if(crawl) {
        /* Intento conseguir y usar alguna ventana con este pid o llamo al error handler */
        try_pid = function(pid, errorcb) {
            wid(pid, function(error, wid, stderr) {
                if(isNaN(wid) || typeof(wid) !== 'number') {
                    return errorcb(pid);
                }

                exec('xprop -id' + wid + ' -f WM_CLASS 8s -set WM_CLASS ' + wmclass);
            });
        };

        /* Consigo el padre e intento usarlo, debería parar en el init, pero bue */
        try_parent = function(pid) {
            ppid(pid, function(error, ppid, stderr) {
                try_pid(pid, try_parent);
            });
        };

        try_pid(pid, try_parent);
    } else {
        wid(pid, function(error, wid, stderr) {
            exec('xprop -id' + wid + ' -f WM_CLASS 8s -set WM_CLASS ' + wmclass);
        });
    }
};
