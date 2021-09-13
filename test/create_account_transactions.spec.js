import { jest } from '@jest/globals';
import Account from '../Account';
import TransactionFactory from '../TransactionFactory';

describe('Create Account', () => {
    it('Creating an account successfully', () => {
        const account = new Account();
        const transactionFactory = new TransactionFactory();
        const line_1 = {'account': {'active-card': false, 'available-limit': 750}};
        const transaction = transactionFactory.getTransactionByLine(line_1);
        const result = transaction.applyTransaction(account);
        expect(result.account['active-card']).toEqual(false);
        expect(result.account['available-limit']).toEqual(750);
        expect(result.violations).toEqual([]);
    });
    it('Creating an account that violates the Authorizer logic', () => {
        const account = new Account();
        const transactionFactory = new TransactionFactory();
        const line_1 = {'account': {'active-card': true, 'available-limit': 175}};
        let transaction = transactionFactory.getTransactionByLine(line_1);
        let result = transaction.applyTransaction(account);
        expect(result.account['active-card']).toEqual(true);
        expect(result.account['available-limit']).toEqual(175);
        expect(result.violations).toEqual([]);
        
        const line_2 = {'account': {'active-card': true, 'available-limit': 350}};
        transaction = transactionFactory.getTransactionByLine(line_2);
        result = transaction.applyTransaction(account);
        expect(result.account['active-card']).toEqual(true);
        expect(result.account['available-limit']).toEqual(175);
        expect(result.violations).toEqual(['account-already-initialized']);
    });
});