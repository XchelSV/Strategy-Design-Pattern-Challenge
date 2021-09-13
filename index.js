import FileParser from "./FileParser.js";
import Account from './Account.js';
import TransactionFactory from "./TransactionFactory.js";

const account = new Account();
const transactionFactory = new TransactionFactory();
const fileParser = new FileParser('file.txt');

for (let i = 0; i < fileParser.lines.length; i++) {
    const transaction = transactionFactory.getTransactionByLine(fileParser.lines[i]);
    const result = transaction.applyTransaction(account);
    console.log(result);
}