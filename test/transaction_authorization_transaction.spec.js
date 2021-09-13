import { jest } from '@jest/globals';
import Account from '../src/account/Account';
import TransactionFactory from '../src/transaction/TransactionFactory';

describe('Transaction Authorization', () => {
    it('Processing a transaction successfully', () => {
        const account = new Account();
        const transactionFactory = new TransactionFactory();
        const line_1 = {'account': {'active-card': true, 'available-limit': 100}};
        let transaction = transactionFactory.getTransactionByLine(line_1);
        let result = transaction.applyTransaction(account);
        expect(result.account['active-card']).toEqual(true);
        expect(result.account['available-limit']).toEqual(100);
        expect(result.violations).toEqual([]);
        
        const line_2 = {'transaction': {'merchant': 'Burger King', 'amount': 20, 'time': '2019-02-13T11:00:00.000Z'}};
        transaction = transactionFactory.getTransactionByLine(line_2);
        result = transaction.applyTransaction(account);
        expect(result.account['active-card']).toEqual(true);
        expect(result.account['available-limit']).toEqual(80);
        expect(result.violations).toEqual([]);
    });
    it('Processing a transaction which violates the account-not-initialized logic', () => {
        const account = new Account();
        const transactionFactory = new TransactionFactory();
        const line_1 = {'transaction': {'merchant': 'Uber Eats', 'amount': 25, 'time': '2020-12-01T11:07:00.000Z'}};
        let transaction = transactionFactory.getTransactionByLine(line_1);
        let result = transaction.applyTransaction(account);
        expect(result.account).toEqual({});
        expect(result.violations).toEqual(['account-not-initialized']);

        const line_2 = {'account': {'active-card': true, 'available-limit': 225}};
        transaction = transactionFactory.getTransactionByLine(line_2);
        result = transaction.applyTransaction(account);
        expect(result.account['active-card']).toEqual(true);
        expect(result.account['available-limit']).toEqual(225);
        expect(result.violations).toEqual([]);

        const line_3 = {'transaction': {'merchant': 'Uber Eats', 'amount': 25, 'time': '2020-12-01T11:07:00.000Z'}};
        transaction = transactionFactory.getTransactionByLine(line_3);
        result = transaction.applyTransaction(account);
        expect(result.account['active-card']).toEqual(true);
        expect(result.account['available-limit']).toEqual(200);
        expect(result.violations).toEqual([]);
    });
    it('Processing a transaction which violates card-not-active logic', () => {
        const account = new Account();
        const transactionFactory = new TransactionFactory();
        const line_1 = {'account': {'active-card': false, 'available-limit': 100}};
        let transaction = transactionFactory.getTransactionByLine(line_1);
        let result = transaction.applyTransaction(account);
        expect(result.account['active-card']).toEqual(false);
        expect(result.account['available-limit']).toEqual(100);
        expect(result.violations).toEqual([]);

        const line_2 = {'transaction': {'merchant': 'Burger King', 'amount': 20, 'time': '2019-02- 13T11:00:00.000Z'}};
        transaction = transactionFactory.getTransactionByLine(line_2);
        result = transaction.applyTransaction(account);
        expect(result.account['active-card']).toEqual(false);
        expect(result.account['available-limit']).toEqual(100);
        expect(result.violations).toEqual(['card-not-active']);

        const line_3 = {'transaction': {'merchant': 'Habbibs', 'amount': 15, 'time': '2019-02- 13T11:15:00.000Z'}};
        transaction = transactionFactory.getTransactionByLine(line_3);
        result = transaction.applyTransaction(account);
        expect(result.account['active-card']).toEqual(false);
        expect(result.account['available-limit']).toEqual(100);
        expect(result.violations).toEqual(['card-not-active']);
    });
    it('Processing a transaction which violates insufficient-limit logic', () => {
        const account = new Account();
        const transactionFactory = new TransactionFactory();
        const line_1 = {'account': {'active-card': true, 'available-limit': 1000}};
        let transaction = transactionFactory.getTransactionByLine(line_1);
        let result = transaction.applyTransaction(account);
        expect(result.account['active-card']).toEqual(true);
        expect(result.account['available-limit']).toEqual(1000);
        expect(result.violations).toEqual([]);

        const line_2 = {'transaction': {'merchant': 'Vivara', 'amount': 1250, 'time': '2019-02-13T11:00:00.000Z'}};
        transaction = transactionFactory.getTransactionByLine(line_2);
        result = transaction.applyTransaction(account);
        expect(result.account['active-card']).toEqual(true);
        expect(result.account['available-limit']).toEqual(1000);
        expect(result.violations).toEqual(['insufficient-limit']);

        const line_3 = {'transaction': {'merchant': 'Samsung', 'amount': 2500, 'time': '2019-02-13T11:00:01.000Z'}};
        transaction = transactionFactory.getTransactionByLine(line_3);
        result = transaction.applyTransaction(account);
        expect(result.account['active-card']).toEqual(true);
        expect(result.account['available-limit']).toEqual(1000);
        expect(result.violations).toEqual(['insufficient-limit']);

        const line_4 = {'transaction': {'merchant': 'Nike', 'amount': 800, 'time': '2019-02-13T11:01:01.000Z'}};
        transaction = transactionFactory.getTransactionByLine(line_4);
        result = transaction.applyTransaction(account);
        expect(result.account['active-card']).toEqual(true);
        expect(result.account['available-limit']).toEqual(200);
        expect(result.violations).toEqual([]);
    });
    it('Processing a transaction which violates the high-frequency-small-interval logic', () => {
        const account = new Account();
        const transactionFactory = new TransactionFactory();
        const line_1 = {'account': {'active-card': true, 'available-limit': 100}}
        let transaction = transactionFactory.getTransactionByLine(line_1);
        let result = transaction.applyTransaction(account);
        expect(result.account['active-card']).toEqual(true);
        expect(result.account['available-limit']).toEqual(100);
        expect(result.violations).toEqual([]);

        const line_2 = {'transaction': {'merchant': 'Burger King', 'amount': 20, 'time': '2019-02-13T11:00:00.000Z'}}
        transaction = transactionFactory.getTransactionByLine(line_2);
        result = transaction.applyTransaction(account);
        expect(result.account['active-card']).toEqual(true);
        expect(result.account['available-limit']).toEqual(80);
        expect(result.violations).toEqual([]);

        const line_3 = {'transaction': {'merchant': 'Habbibs', 'amount': 20, 'time': '2019-02-13T11:00:01.000Z'}}
        transaction = transactionFactory.getTransactionByLine(line_3);
        result = transaction.applyTransaction(account);
        expect(result.account['active-card']).toEqual(true);
        expect(result.account['available-limit']).toEqual(60);
        expect(result.violations).toEqual([]);

        const line_4 = {'transaction': {'merchant': 'McDonalds', 'amount': 20, 'time': '2019-02-13T11:01:01.000Z'}}
        transaction = transactionFactory.getTransactionByLine(line_4);
        result = transaction.applyTransaction(account);
        expect(result.account['active-card']).toEqual(true);
        expect(result.account['available-limit']).toEqual(40);
        expect(result.violations).toEqual([]);

        const line_5 = {'transaction': {'merchant': 'Subway', 'amount': 20, 'time': '2019-02-13T11:01:31.000Z'}}
        transaction = transactionFactory.getTransactionByLine(line_5);
        result = transaction.applyTransaction(account);
        expect(result.account['active-card']).toEqual(true);
        expect(result.account['available-limit']).toEqual(40);
        expect(result.violations).toEqual(['high-frequency-small-interval']);

        const line_6 = {'transaction': {'merchant': 'Burger King', 'amount': 10, 'time': '2019-02-13T12:00:00.000Z'}}
        transaction = transactionFactory.getTransactionByLine(line_6);
        result = transaction.applyTransaction(account);
        expect(result.account['active-card']).toEqual(true);
        expect(result.account['available-limit']).toEqual(30);
        expect(result.violations).toEqual([]);
    });
    it('Processing a transaction which violates the doubled-transaction logic', () => {
        const account = new Account();
        const transactionFactory = new TransactionFactory();
        const line_1 = {'account': {'active-card': true, 'available-limit': 100}}
        let transaction = transactionFactory.getTransactionByLine(line_1);
        let result = transaction.applyTransaction(account);
        expect(result.account['active-card']).toEqual(true);
        expect(result.account['available-limit']).toEqual(100);
        expect(result.violations).toEqual([]);

        const line_2 = {'transaction': {'merchant': 'Burger King', 'amount': 20, 'time': '2019-02-13T11:00:00.000Z'}}
        transaction = transactionFactory.getTransactionByLine(line_2);
        result = transaction.applyTransaction(account);
        expect(result.account['active-card']).toEqual(true);
        expect(result.account['available-limit']).toEqual(80);
        expect(result.violations).toEqual([]);

        const line_3 = {'transaction': {'merchant': 'McDonalds', 'amount': 10, 'time': '2019-02-13T11:00:01.000Z'}}
        transaction = transactionFactory.getTransactionByLine(line_3);
        result = transaction.applyTransaction(account);
        expect(result.account['active-card']).toEqual(true);
        expect(result.account['available-limit']).toEqual(70);
        expect(result.violations).toEqual([]);

        const line_4 = {'transaction': {'merchant': 'Burger King', 'amount': 20, 'time': '2019-02-13T11:00:02.000Z'}}
        transaction = transactionFactory.getTransactionByLine(line_4);
        result = transaction.applyTransaction(account);
        expect(result.account['active-card']).toEqual(true);
        expect(result.account['available-limit']).toEqual(70);
        expect(result.violations).toEqual(['doubled-transaction']);

        const line_5 = {'transaction': {'merchant': 'Burger King', 'amount': 15, 'time': '2019-02-13T11:00:03.000Z'}}
        transaction = transactionFactory.getTransactionByLine(line_5);
        result = transaction.applyTransaction(account);
        expect(result.account['active-card']).toEqual(true);
        expect(result.account['available-limit']).toEqual(55);
        expect(result.violations).toEqual([]);
    });
    it('Processing transactions that violate multiple logics', () => {
        const account = new Account();
        const transactionFactory = new TransactionFactory();
        const line_1 = {'account': {'active-card': true, 'available-limit': 100}}
        let transaction = transactionFactory.getTransactionByLine(line_1);
        let result = transaction.applyTransaction(account);
        expect(result.account['active-card']).toEqual(true);
        expect(result.account['available-limit']).toEqual(100);
        expect(result.violations).toEqual([]);

        const line_2 = {'transaction': {'merchant': 'McDonalds', 'amount': 10, 'time': '2019-02-13T11:00:01.000Z'}}
        transaction = transactionFactory.getTransactionByLine(line_2);
        result = transaction.applyTransaction(account);
        expect(result.account['active-card']).toEqual(true);
        expect(result.account['available-limit']).toEqual(90);
        expect(result.violations).toEqual([]);

        const line_3 = {'transaction': {'merchant': 'Burger King', 'amount': 20, 'time': '2019-02-13T11:00:02.000Z'}}
        transaction = transactionFactory.getTransactionByLine(line_3);
        result = transaction.applyTransaction(account);
        expect(result.account['active-card']).toEqual(true);
        expect(result.account['available-limit']).toEqual(70);
        expect(result.violations).toEqual([]);

        const line_4 = {'transaction': {'merchant': 'Burger King', 'amount': 5, 'time': '2019-02-13T11:00:07.000Z'}}
        transaction = transactionFactory.getTransactionByLine(line_4);
        result = transaction.applyTransaction(account);
        expect(result.account['active-card']).toEqual(true);
        expect(result.account['available-limit']).toEqual(65);
        expect(result.violations).toEqual([]);

        const line_5 = {'transaction': {'merchant': 'Burger King', 'amount': 5, 'time': '2019-02-13T11:00:08.000Z'}}
        transaction = transactionFactory.getTransactionByLine(line_5);
        result = transaction.applyTransaction(account);
        expect(result.account['active-card']).toEqual(true);
        expect(result.account['available-limit']).toEqual(65);
        expect(result.violations).toEqual(['high-frequency-small-interval','doubled-transaction']);
        
        const line_6 = {'transaction': {'merchant': 'Burger King', 'amount': 150, 'time': '2019-02-13T11:00:18.000Z'}}
        transaction = transactionFactory.getTransactionByLine(line_6);
        result = transaction.applyTransaction(account);
        expect(result.account['active-card']).toEqual(true);
        expect(result.account['available-limit']).toEqual(65);
        expect(result.violations).toEqual(['insufficient-limit','high-frequency-small-interval']);

        const line_7 = {'transaction': {'merchant': 'Burger King', 'amount': 190, 'time': '2019-02-13T11:00:22.000Z'}}
        transaction = transactionFactory.getTransactionByLine(line_7);
        result = transaction.applyTransaction(account);
        expect(result.account['active-card']).toEqual(true);
        expect(result.account['available-limit']).toEqual(65);
        expect(result.violations).toEqual(['insufficient-limit','high-frequency-small-interval']);

        const line_8 = {'transaction': {'merchant': 'Burger King', 'amount': 15, 'time': '2019-02-13T12:00:27.000Z'}}
        transaction = transactionFactory.getTransactionByLine(line_8);
        result = transaction.applyTransaction(account);
        expect(result.account['active-card']).toEqual(true);
        expect(result.account['available-limit']).toEqual(50);
        expect(result.violations).toEqual([]);
    });
});