import Transaction from "./Transaction.js";

class TransactionAuthorization extends Transaction {
    constructor(action_object){
        super(action_object);
    }
    applyTransaction(account){
        this.validateAccountNotInitialized(account);
        this.validateCardNotActive(account);
        this.validateInsufficentLimit(account);
        if (this.violations.length === 0){
            account.addTransactions(this.action_object);
        }
        return {'account': (account.getAvailableLimit()) ? {'active-card': account.getActiveCard(), 'available-limit': account.getAvailableLimit()} : {}, 'violations': this.violations}
    }
    validateAccountNotInitialized(account){
        if (!account.getActiveCard() && !account.getAvailableLimit()){
            this.violations.push('account-not-initialized');
        }
    }
    validateCardNotActive(account){
        if (!account.getActiveCard() && account.getAvailableLimit()){
            this.violations.push('card-not-active');
        }
    }
    validateInsufficentLimit(account){
        if (account.getAvailableLimit() < this.action_object.amount){
            this.violations.push('insufficient-limit');
        }
    }
}

export default TransactionAuthorization;