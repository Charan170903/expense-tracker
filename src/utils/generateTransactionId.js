// src/utils/generateTransactionId.js
export function generateTransactionId() {
    // Keep the same format as before but move impure calls out of component scope
    return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}
