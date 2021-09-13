import Transaction from "./Transaction.js";

class TransactionAuthorization extends Transaction {
    constructor(action_object){
        super(action_object);
    }
    applyTransaction(account){
        this.validateAccountNotInitialized(account);
        if (this.violations.length === 0){
            account.addTransactions(this.action_object);
        }
        return {'account': (account.getActiveCard() && account.getAvailableLimit()) ? {'active-card': account.getActiveCard(), 'available-limit': account.getAvailableLimit()} : {}, 'violations': this.violations}
    }
    validateAccountNotInitialized(account){
        if (!account.getActiveCard() && !account.getAvailableLimit()){
            this.violations.push('account-not-initialized');
        }
    }
}

export default TransactionAuthorization;