const St = imports.gi.St;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;
const Signals = imports.signals;
const Soup = imports.gi.Soup;
const Mainloop = imports.mainloop;
const httpSession = new Soup.SessionAsync();

httpSession['user-agent'] = "gnome-shell-extension";

let button;
let url = 'http://api.salam-donya.ir/issues.json';

function callback(status, data) {
    let msg;
    if (status == 200) {
        let dataObj = JSON.parse(data);
        let id = dataObj[dataObj.length - 1].id.toString();
        //let url = dataObj[dataObj.length - 1].url.toString();
        msg = "شماره " + id + " مجله سلام دنیا برای دانلود آماده هست";
        //msg += "\n";
        //msg += "لینک دانلود: " + url;
    }
    else {
        msg = status;
    }

    let text = new St.Label({style_class: 'msg', text: msg});
    Main.uiGroup.add_actor(text);
    text.opacity = 255;
    let monitor = Main.layoutManager.primaryMonitor;
    text.set_position(monitor.x + Math.floor(monitor.width / 2 - text.width / 2),
        monitor.y + Math.floor(monitor.height / 2 - text.height / 2));

    Tweener.addTween(text,
        {
            opacity: 0,
            time: 8,
            transition: 'easeOutQuad',
            onComplete: hideMsg
        });
}

function getData() {
    let message = Soup.Message.new("GET", url);
    httpSession.queue_message(
        message,
        function (session, message) {
            callback(message.status_code, message.response_body.data);
        }
    );
}

function init() {
    button = new St.Bin({
        style_class: 'panel-button',
        reactive: true,
        can_focus: true,
        x_fill: true,
        y_fill: false,
        track_hover: true
    });
    let icon = new St.Icon({
        icon_name: 'emblem-documents-symbolic',
        style_class: 'system-status-icon'
    });

    button.set_child(icon);
    button.connect('button-press-event', getData);
}

function enable() {
    Main.panel._rightBox.insert_child_at_index(button, 0);
}

function disable() {
    Main.panel._rightBox.remove_child(button);
}
