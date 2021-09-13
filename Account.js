class Account {
    active_card;
    available_limit;
    transactions = [];
    setActiveCard(status){
        this.active_card = status;
    }
    getActiveCard(){
        return this.active_card
    }
    setAvailableLimit(limit){
        this.available_limit = limit;
    }
    getAvailableLimit(){
        return this.available_limit;
    }
    addTransactions(transaction){
        this.available_limit -= transaction.amount;
        this.transactions.push(transaction);
    }
    getTransactions(){
        return this.transactions;
    }
}

export default Account;