import FileParser from "./parser/FileParser.js";
import Account from './account/Account.js';
import TransactionFactory from "./transaction/TransactionFactory.js";

class Authorizer {
    account = new Account();
    transactionFactory = new TransactionFactory();
    fileParser;
    authorize(fileName){
        this.fileParser = new FileParser(fileName);
        for (let i = 0; i < this.fileParser.lines.length; i++) {
            const transaction = this.transactionFactory.getTransactionByLine(this.fileParser.lines[i]);
            const result = transaction.applyTransaction(this.account);
            console.log(result);
        }
    }
}

export default Authorizer;