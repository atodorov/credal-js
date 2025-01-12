import { ApiPromise } from '@polkadot/api';
import {
    PalletCreditcoinAddress,
    PalletCreditcoinAskOrder,
    PalletCreditcoinBidOrder,
    PalletCreditcoinDealOrder,
    PalletCreditcoinLoanTerms,
    PalletCreditcoinOffer,
} from '@polkadot/types/lookup';
import { Address, AskOrder, LoanTerms, BidOrder, Offer, AskOrderId, BidOrderId, DealOrder, OfferId } from './model';

export const createAddress = ({ value, blockchain, owner }: PalletCreditcoinAddress): Address => ({
    accountId: owner.toString(),
    blockchain: blockchain.type,
    externalAddress: value.toString(),
});

export const createLoanTerms = ({ amount, interestRate, maturity }: PalletCreditcoinLoanTerms): LoanTerms => ({
    amount: amount.toBigInt(),
    interestRate: interestRate.toNumber(),
    maturity: new Date(maturity.toNumber()),
});

export const createCreditcoinLoanTerms = (
    api: ApiPromise,
    { amount, interestRate, maturity }: LoanTerms,
): PalletCreditcoinLoanTerms =>
    api.createType('PalletCreditcoinLoanTerms', {
        amount,
        interestRate,
        maturity: Math.floor(maturity.getTime()),
    });

export const createAskOrder = ({
    blockchain,
    terms,
    lenderAddressId,
    expirationBlock,
    block,
    lender,
}: PalletCreditcoinAskOrder): AskOrder => ({
    blockchain: blockchain.type,
    blockNumber: block.toNumber(),
    expirationBlock: expirationBlock.toNumber(),
    loanTerms: createLoanTerms(terms),
    lenderAddressId: lenderAddressId.toString(),
    lenderAccountId: lender.toString(),
});

export const createBidOrder = ({
    blockchain,
    terms,
    borrowerAddressId,
    expirationBlock,
    block,
    borrower,
}: PalletCreditcoinBidOrder): BidOrder => ({
    blockchain: blockchain.type,
    blockNumber: block.toNumber(),
    expirationBlock: expirationBlock.toNumber(),
    loanTerms: createLoanTerms(terms),
    borrowerAddressId: borrowerAddressId.toString(),
    borrowerAccountId: borrower.toString(),
});

export const createOffer = ({
    blockchain,
    askId,
    bidId,
    expirationBlock,
    block,
    lender,
}: PalletCreditcoinOffer): Offer => ({
    blockchain: blockchain.type,
    askOrderId: askId.toJSON() as AskOrderId,
    bidOrderId: bidId.toJSON() as BidOrderId,
    expirationBlock: expirationBlock.toNumber(),
    blockNumber: block.toNumber(),
    lenderAccountId: lender.toString(),
});

export const createDealOrder = (dealOrder: PalletCreditcoinDealOrder): DealOrder => {
    const {
        offerId,
        lenderAddressId,
        borrowerAddressId,
        terms,
        expirationBlock,
        timestamp,
        fundingTransferId,
        repaymentTransferId,
        lock,
        borrower,
    } = dealOrder;
    return {
        offerId: offerId.toJSON() as OfferId,
        lenderAddressId: lenderAddressId.toString(),
        borrowerAddressId: borrowerAddressId.toString(),
        loanTerms: createLoanTerms(terms),
        expirationBlock: expirationBlock.toNumber(),
        timestamp: new Date(timestamp.toNumber()),
        fundingTransferId: fundingTransferId.unwrapOr(undefined)?.toString(),
        repaymentTransferId: repaymentTransferId.unwrapOr(undefined)?.toString(),
        lock: lock.unwrapOr(undefined)?.toString(),
        borrower: borrower.toString(),
    };
};
