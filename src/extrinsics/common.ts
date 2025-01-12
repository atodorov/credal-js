import { ApiPromise, SubmittableResult } from '@polkadot/api';

export const handleTransactionFailed = (api: ApiPromise, result: SubmittableResult) => {
    const { dispatchError } = result;
    if (dispatchError) {
        if (dispatchError.isModule) {
            const decoded = api.registry.findMetaError(dispatchError.asModule);
            const { docs, name, section } = decoded;
            return Error(`${section}.${name}: ${docs.join(' ')}`);
        }
        return new Error(dispatchError.toString());
    }
    return new Error('Unknown Error');
};
export const handleTransaction = (
    api: ApiPromise,
    unsubscribe: () => void,
    result: SubmittableResult,
    onSuccess: (r: SubmittableResult) => void,
    onFail: (r: SubmittableResult) => void,
) => {
    const { status, events, dispatchError } = result;
    console.log(`current status is ${status.toString()}`);
    if (dispatchError) {
        if (dispatchError.isModule) {
            const decoded = api.registry.findMetaError(dispatchError.asModule);
            const { docs, name, section } = decoded;

            console.log(`${section}.${name}: ${docs.join(' ')}`);
        } else {
            console.log(dispatchError.toString());
        }

        onFail(result);
        unsubscribe();
    }
    if (status.isInBlock) {
        events.forEach(({ event }) => {
            const types = event.typeDef;
            event.data.forEach((data, index) => {
                console.log(`pallet: ${event.section} event name: ${event.method}`);
                console.log(`event types ${types[index].type} event data: ${data.toString()}`);
            });
        });

        onSuccess(result);
        unsubscribe();
    }
};
