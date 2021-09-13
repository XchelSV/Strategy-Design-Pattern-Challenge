import Transaction from './Transaction.js';

class AccountCreation extends Transaction {
    constructor(action_object){
        super(action_object);
    }
    applyTransaction(account){
        this.validateAccountAlreadyInitialized(account);
        if (this.violations.length === 0){
            account.setActiveCard(this.action_object['active-card']);
            account.setAvailableLimit(this.action_object['available-limit']);
        }
        return {'account': {'active-card': account.getActiveCard(), 'available-limit': account.getAvailableLimit()}, 'violations': this.violations}
    }
    validateAccountAlreadyInitialized(account){
        if (account.getActiveCard() && account.getAvailableLimit()){
            this.violations.push('account-already-initialized');
        }
    }
}

export default AccountCreation;