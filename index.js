import api from '@actual-app/api';

const SERVER_URL = process.env.ACTUAL_URL;
const PASSWORD = process.env.ACTUAL_PASSWORD;
const SYNC_ID = process.env.ACTUAL_SYNC_ID;

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
  console.log(`Obtaining budget of ${budgetMonth}`);

  let budget = await api.getBudgetMonth(budgetMonth);
  processToBudget(budget);
  processCategories(budget);

  await api.shutdown();

  let finalMessage = reportMessages.join("\n");
  console.log(finalMessage);
};

function processToBudget(budget) {
  if (budget.toBudget > 0 ) {
    addMessage(`[To Budget] R$ ${printMoney(budget.toBudget)}`);
  };
};

function processCategories(budget) {
  for (const categoryGroup of budget.categoryGroups) {
    for (const category of categoryGroup.categories) {
      if (category.balance > 0) {
        addMessage(`[${categoryGroup.name}] [${category.name}] R$ ${printMoney(category.balance)}`);
      };
    };
  };
};

function printMoney(value) {
  return (value / 100).toFixed(2);
}

function addMessage(message) {
  reportMessages.push(message);
  console.log(`Message: ${message}`);
}

await main();
