export const initializeTelegramWebApp = () => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
    }
  };
  
  export const closeTelegramWebApp = () => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.close();
    }
  };