import AccountCreation from "./AccountCreation.js";
import TransactionAuthorization from "./TransactionAuthorization.js";

class TransactionFactory {
    getTransactionByLine(fileLine){
        const [ key ] = Object.keys(fileLine);
        switch (key) {
            case 'account':
                return new AccountCreation(fileLine.account);
            case 'transaction':
                return new TransactionAuthorization(fileLine.transaction);
        }
    }
}

export default TransactionFactory;