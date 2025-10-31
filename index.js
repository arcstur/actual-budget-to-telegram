import api from '@actual-app/api';
import axios from 'axios';
import fs from 'fs';

const CACHE_DIR = getEnv("ACTUAL_CACHE_DIR");
const SERVER_URL = getEnv("ACTUAL_URL");
const PASSWORD = getEnv("ACTUAL_PASSWORD");
const SYNC_ID = getEnv("ACTUAL_SYNC_ID");
const TELEGRAM_BOT_TOKEN = getEnv("TELEGRAM_BOT_TOKEN");
const TELEGRAM_CHAT_ID = getEnv("TELEGRAM_CHAT_ID");

const reportMessages = [];

async function main() {
  if (!fs.existsSync(CACHE_DIR)) {
    console.log(`${CACHE_DIR} does not exist, creating directory...`);
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }

  await api.init({
    dataDir: CACHE_DIR,
    serverURL: SERVER_URL,
    password: PASSWORD,
  });
  await api.downloadBudget(SYNC_ID);

  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const budgetMonth = `${year}-${month}`;
  const monthPrint = date.toLocaleDateString('pt-BR', { year: "numeric", month: "long" });
  console.log(`Obtaining budget of ${budgetMonth}`);
  addMessageRaw(`== ${monthPrint} ==\n`)

  let budget = await api.getBudgetMonth(budgetMonth);
  addMessageMoney(budget.toBudget, "[To Budget]");
  processCategories(budget);

  await api.shutdown();
  await sendFinalMessage();
};

function processCategories(budget) {
  for (const categoryGroup of budget.categoryGroups) {
    for (const category of categoryGroup.categories) {
      addMessageMoney(category.balance, `[${categoryGroup.name}] [${category.name}]`);
    };
  };
};

function addMessageMoney(value, title) {
  if (value > 0) {
    const printed = (value / 100).toFixed(2);
    const message = `${title} R$ ${printed}`;
    addMessageRaw(message);
  }
}

function addMessageRaw(message) {
  reportMessages.push(message);
}


async function sendFinalMessage() {
  // TODO: don't send the same message twice
  let finalMessage = reportMessages.join("\n");
  const postData = {
    chat_id: TELEGRAM_CHAT_ID,
    text: finalMessage
  };
  const apiEndpoint = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  console.log("Sending final message through Telegram...");
  await axios.post(apiEndpoint, postData);
}

function getEnv(name) {
  let variable = process.env[name];
  if (!variable) {
    throw Error(`environment variable "${name}" not present`);
  };
  return variable;
}

await main();
