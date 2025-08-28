# Actual Budget to Telegram

Telegram bot that sends reports and updates from Actual Budget

## Running

```bash
npm install
node index.js
```

## Environment variables

* `ACTUAL_CACHE_DIR`: local directory to cache Actual files
* `ACTUAL_URL`: URL of the server hosting your Actual Budget
* `ACTUAL_PASSWORD`: server's password
* `ACTUAL_SYNC_ID`: budget's sync id, obtained from settings -> advanced settings
* `TELEGRAM_BOT_TOKEN`: your Telegram bot's token
* `TELEGRAM_CHAT_ID`: Telegram chat ID to send messages to
