import api from '@actual-app/api';
import axios from 'axios';

const SERVER_URL = process.env.ACTUAL_URL;
const PASSWORD = process.env.ACTUAL_PASSWORD;
const SYNC_ID = process.env.ACTUAL_SYNC_ID;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const reportMessages = [];

async function main() {
  await api.init({
    dataDir: './cache',
    serverURL: SERVER_URL,
    password: PASSWORD,
  });
  await api.downloadBudget(SYNC_ID);

  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const budgetMonth = `${year}-${month}`;
  const monthPrint = date.toLocaleDateString('pt-BR', {year: "numeric", month: "long"});
  console.log(`Obtaining budget of ${budgetMonth}`);
  addMessage(`== ${monthPrint} ==\n`)

  let budget = await api.getBudgetMonth(budgetMonth);
  processToBudget(budget);
  processCategories(budget);

  await api.shutdown();
  await sendFinalMessage();
};

function processToBudget(budget) {
  if (budget.toBudget > 0 ) {
    addMessage(`[To Budget] ${printMoney(budget.toBudget)}`);
  };
};

function processCategories(budget) {
  for (const categoryGroup of budget.categoryGroups) {
    for (const category of categoryGroup.categories) {
      if (category.balance > 0) {
        addMessage(`[${categoryGroup.name}] [${category.name}] ${printMoney(category.balance)}`);
      };
    };
  };
};

function printMoney(value) {
  const number = (value / 100).toFixed(2);
  return `R$ ${number}`;
}

function addMessage(message) {
  reportMessages.push(message);
  console.log(`Message: ${message}`);
}

async function sendFinalMessage() {
  let finalMessage = reportMessages.join("\n");
  const postData = {
    chat_id: TELEGRAM_CHAT_ID,
    text: finalMessage
  };
  const apiEndpoint = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  console.log("Sending final message through Telegram...");
  await axios.post(apiEndpoint, postData);
}

await main();
