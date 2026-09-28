"use client";

import { useEffect, useState } from "react";
import css from "./InstallPrompt.module.css";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "pwa-install-dismissed";

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [iosHint, setIosHint] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    if (localStorage.getItem(DISMISS_KEY) === "1") return;

    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isSafari = /safari/i.test(navigator.userAgent) && !/crios|fxios/i.test(navigator.userAgent);

    if (isIos && isSafari) {
      setIosHint(true);
      setVisible(true);
      return;
    }

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  }

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className={css.banner} role="dialog" aria-label="Встановити додаток">
      <div className={css.text}>
        <strong>На головний екран</strong>
        {iosHint ? (
          <p>
            Натисни <span className={css.share}>Поділитися</span> → «На екран «Дому»»
          </p>
        ) : (
          <p>Встанови як додаток — швидший доступ з телефону</p>
        )}
      </div>
      <div className={css.actions}>
        {!iosHint && deferred ? (
          <button type="button" className={css.install} onClick={install}>
            Встановити
          </button>
        ) : null}
        <button type="button" className={css.dismiss} onClick={dismiss} aria-label="Закрити">
          ✕
        </button>
      </div>
    </div>
  );
}