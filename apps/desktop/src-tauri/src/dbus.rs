use std::sync::atomic::Ordering;
use tauri::{AppHandle, Manager};
use zbus::interface;
use crate::{commands::_set_pin, HideTaskbarWhenPinned, Pinned, TrayMenu};

pub struct PinControl {
    app: AppHandle,
}

impl PinControl {
    pub fn new(app: AppHandle) -> Self {
        Self { app }
    }
}

#[interface(name = "dev.overlayed.PinControl")]
impl PinControl {
    #[zbus(signal)]
    async fn pin_status_changed(ctxt: &zbus::SignalContext<'_>, pinned: bool) -> zbus::Result<()>;

    /// Toggle the pin status
    async fn toggle_pin(&mut self) -> zbus::fdo::Result<bool> {
        let pinned_state = self.app.state::<Pinned>();
        let current = pinned_state.load(Ordering::Relaxed);
        let new_val = !current;
        
        let window = self.app.get_webview_window(crate::constants::MAIN_WINDOW_NAME)
            .ok_or_else(|| zbus::fdo::Error::Failed("Window not found".into()))?;
        let menu = self.app.state::<TrayMenu>();
        let hide_taskbar = self.app.state::<HideTaskbarWhenPinned>();
        
        _set_pin(new_val, &window, pinned_state, menu, hide_taskbar);
        
        // Signal emission is handled by `_set_pin` via `emit_pin_changed`
        Ok(new_val)
    }

    /// Get current pin status
    #[zbus(property)]
    async fn pinned(&self) -> bool {
        let pinned_state = self.app.state::<Pinned>();
        pinned_state.load(Ordering::Relaxed)
    }

    /// Set pin status
    #[zbus(property)]
    async fn set_pinned(&mut self, value: bool) -> zbus::fdo::Result<()> {
        let pinned_state = self.app.state::<Pinned>();
        let window = self.app.get_webview_window(crate::constants::MAIN_WINDOW_NAME)
            .ok_or_else(|| zbus::fdo::Error::Failed("Window not found".into()))?;
        let menu = self.app.state::<TrayMenu>();
        let hide_taskbar = self.app.state::<HideTaskbarWhenPinned>();
        
        _set_pin(value, &window, pinned_state, menu, hide_taskbar);
        Ok(())
    }
}

pub fn emit_pin_changed(app: &AppHandle, pinned: bool) {
    if let Some(conn) = app.try_state::<zbus::Connection>() {
        let conn = conn.inner().clone();
        tauri::async_runtime::spawn(async move {
            let _ = conn.emit_signal(
                Option::<&str>::None,
                "/dev/overlayed/PinControl",
                "dev.overlayed.PinControl",
                "PinStatusChanged",
                &(pinned,),
            ).await;
        });
    }
}
