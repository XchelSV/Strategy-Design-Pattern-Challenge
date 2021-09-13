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
    getTransactions(init_date=null, end_date= null, merchant=null, amount=null){
        let transactions = this.transactions;
        if (init_date && end_date){
            transactions = transactions.filter((transaction) => {
                const transaction_date = new Date(transaction.time);
                if (transaction_date.getTime() >= init_date.getTime() && transaction_date.getTime() <= end_date.getTime()){
                    return transaction;
                }
            });
        }
        if (merchant){
            transactions = transactions.filter((transaction) => transaction.merchant === merchant);
        }
        if (amount){
            transactions = transactions.filter((transaction) => transaction.amount === amount);
        }
        return transactions;
    }
}

export default Account;