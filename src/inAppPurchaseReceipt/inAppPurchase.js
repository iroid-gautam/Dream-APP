import VerifyReceipt from "./verify-receipt";

class InAppPurchaseFactory {
    constructor(receipt, isTestEnvironment) {
        return new VerifyReceipt(receipt, isTestEnvironment);
    }
}

export default InAppPurchaseFactory;
