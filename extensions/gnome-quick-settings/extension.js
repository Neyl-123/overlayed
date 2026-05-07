import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import GObject from 'gi://GObject';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as QuickSettings from 'resource:///org/gnome/shell/ui/quickSettings.js';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';

const BUS_NAME = 'dev.overlayed';
const OBJECT_PATH = '/dev/overlayed/PinControl';
const INTERFACE_NAME = 'dev.overlayed.PinControl';

// Create a D-Bus proxy interface wrapper
const PinControlProxyInterface = `
<node>
  <interface name="dev.overlayed.PinControl">
    <method name="TogglePin">
      <arg direction="out" type="b"/>
    </method>
    <property name="Pinned" type="b" access="readwrite"/>
    <signal name="PinStatusChanged">
      <arg name="pinned" type="b"/>
    </signal>
  </interface>
</node>`;

const PinControlProxy = Gio.DBusProxy.makeProxyWrapper(PinControlProxyInterface);

const OverlayedIndicator = GObject.registerClass(
    class OverlayedIndicator extends QuickSettings.SystemIndicator {
        constructor() {
            super();

            this._toggle = new QuickSettings.QuickToggle({
                title: 'Overlayed',
                iconName: 'view-pin-symbolic',
            });

            this.quickSettingsItems.push(this._toggle);
            this._toggle.visible = false;

            this._proxy = null;
            this._signalId = 0;
            this._propSignalId = 0;

            this._nameWatchId = Gio.bus_watch_name(
                Gio.BusType.SESSION,
                BUS_NAME,
                Gio.BusNameWatcherFlags.NONE,
                () => {
                    this._toggle.visible = true;
                    this._connectToDBus();
                },
                () => {
                    this._toggle.visible = false;
                    this._disconnectFromDBus();
                }
            );

            this._toggle.connect('clicked', () => {
                if (this._proxy) {
                    this._proxy.TogglePinRemote((result, err) => {
                        if (err) {
                            console.error(`Failed to toggle pin: ${err.message}`);
                        }
                    });
                }
            });
        }

        _connectToDBus() {
            new PinControlProxy(
                Gio.DBus.session,
                BUS_NAME,
                OBJECT_PATH,
                (proxy, err) => {
                    if (err) {
                        console.error(`Failed to connect to Overlayed DBus: ${err.message}`);
                        return;
                    }
                    this._proxy = proxy;

                    // Fetch initial state
                    this._toggle.checked = this._proxy.Pinned;

                    // Listen for PinStatusChanged signal
                    this._signalId = this._proxy.connectSignal('PinStatusChanged', (proxy, name, [pinned]) => {
                        this._toggle.checked = pinned;
                    });

                    // Also listen for PropertiesChanged in case we use that
                    this._propSignalId = this._proxy.connect('g-properties-changed', (proxy, changed, invalidated) => {
                        if (changed.unpack().hasOwnProperty('Pinned')) {
                            this._toggle.checked = this._proxy.Pinned;
                        }
                    });
                }
            );
        }

        _disconnectFromDBus() {
            if (this._proxy) {
                if (this._signalId) {
                    this._proxy.disconnectSignal(this._signalId);
                    this._signalId = 0;
                }
                if (this._propSignalId) {
                    this._proxy.disconnect(this._propSignalId);
                    this._propSignalId = 0;
                }
                this._proxy = null;
            }
        }

        destroy() {
            if (this._nameWatchId) {
                Gio.bus_unwatch_name(this._nameWatchId);
                this._nameWatchId = 0;
            }
            this._disconnectFromDBus();
            super.destroy();
        }
    });

export default class OverlayedPinExtension extends Extension {
    enable() {
        this._indicator = new OverlayedIndicator();
        Main.panel.statusArea.quickSettings.addExternalIndicator(this._indicator);
    }

    disable() {
        if (this._indicator) {
            this._indicator.destroy();
            this._indicator = null;
        }
    }
}
