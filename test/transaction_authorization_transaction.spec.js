import { jest } from '@jest/globals';
import Account from '../Account';
import TransactionFactory from '../TransactionFactory';

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
});