var exec = require('child_process').exec;

function get_ppid(pid, cb) {
    exec('ps hoppid ' + pid, cb);
}

function get_wid(pid, cb) {
    exec('wmctrl -lp | grep ' + pid + ' | cut -d \' \' -f1', cb);
}

function set_wmclass(class, crawl, pid) {
    crawl = crawl || false;
    pid   = proc  || process.pid;

    /* Debería en realidad ir subiendo en el árbol de procesos hasta encontrar una ventana o el init */
    if(crawl) {
        get_ppid(pid, function(error, ppid, stderr) {
            get_wid(ppid, function(error, wid, stderr) {
                exec('xprop -id' + wid + ' -f WM_CLASS 8s -set WM_CLASS ' + class);
            });
        });
    } else {
        get_wid(pid, function(error, wid, stderr) {
            exec('xprop -id' + wid + ' -f WM_CLASS 8s -set WM_CLASS ' + class);
        });
    }
}

exports = {
    ppid: get_ppid,
    wid:  get_wid,
    set_wmclass: set_wmclass
};
