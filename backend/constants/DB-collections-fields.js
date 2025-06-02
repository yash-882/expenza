// contains all db collections fields for validation purpose 
export const TransactionFields = {
        // numeric fields
        numericFields: new Set(["amount"]),

        // all fields 
        allFields: new Set([
        "_id",
        "type",
        "category",
        "createdAt",
        "amount",
        "description",
        "user",
        "lastUpdated",
])}