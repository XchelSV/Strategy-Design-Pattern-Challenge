class Transaction {
    constructor(action_object){
        this.action_object = action_object;
        this.violations = [];
    }
    applyTransaction(account){}
}

export default Transaction;