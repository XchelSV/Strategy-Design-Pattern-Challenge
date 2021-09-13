import Transaction from "./Transaction.js";

class TransactionAuthorization extends Transaction {
    constructor(action_object){
        super(action_object);
    }
    applyTransaction(account){
        this.validateAccountNotInitialized(account);
        this.validateCardNotActive(account);
        this.validateInsufficentLimit(account);
        this.validateHighFrecuencySmallInterval(account);
        this.validateDoubledTransaction(account);
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
    validateHighFrecuencySmallInterval(account){
        const current_date = new Date(this.action_object.time);
        const _2_minutes_before_date = new Date(current_date.getTime() - 2*60000);
        const last_2_minutes_transactions = account.getTransactions(_2_minutes_before_date, current_date);
        if (last_2_minutes_transactions.length >= 3){
            this.violations.push('high-frequency-small-interval');
        }
    }
    validateDoubledTransaction(account){
        const current_date = new Date(this.action_object.time);
        const _2_minutes_before_date = new Date(current_date.getTime() - 2*60000);
        const last_2_minutes_transactions = account.getTransactions(_2_minutes_before_date, current_date, this.action_object.merchant, this.action_object.amount);
        if (last_2_minutes_transactions.length >= 1){
            this.violations.push('doubled-transaction');
        }
    }
}

export default TransactionAuthorization;