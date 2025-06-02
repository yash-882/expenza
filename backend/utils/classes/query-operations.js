// query strings operation
class QueryOpt{

    constructor(query, validFields) {
        this.query = query; // incoming query object from client
        this.sortBy = query.sort || '-createdAt'; // default sort
        this.selectedFields = query.select || null; // default selected fields
        this.validFields = validFields; // object of valid document fields(contains Set fields)
    }

    // Normalize numeric filters, like gt/gte/etc
    normalizeQueryFilters(fieldName) {
        const allowedOperators = ['lt', 'lte', 'gt', 'gte'];
        let fieldValue = this.query[fieldName];

        // if the field contains null or an empty string
        if (!fieldValue) {
            delete this.query[fieldName];
            return;
        }

        // is object? like.. {'gte': 10}
        const isObject = typeof fieldValue === 'object' && fieldValue !== null && !Array.isArray(fieldValue);

        if (isObject) {
            Object.keys(fieldValue).forEach(operatorInQuery => {
                // converts to number or return NaN for non numeric values
                const numericVal = Number(fieldValue[operatorInQuery]); //{'gt:'3'} -> {'gt':3}

                if (allowedOperators.includes(operatorInQuery) && !isNaN(numericVal)) {
                    fieldValue[operatorInQuery] = numericVal;
                } else {
                    // delete if not valid operator or if it is not numeric
                    delete fieldValue[operatorInQuery];
                }
            });

            // all operators were invalid
            if (!Object.keys(fieldValue).length) {
                // remove the field
                delete this.query[fieldName];
            }
        } else {
            const numericVal = Number(fieldValue);
            if (!isNaN(numericVal)) {
                this.query[fieldName] = numericVal;
            } else {
                delete this.query[fieldName];
            }
        }
    }

    createFilter() {
        // numeric fields
        const numericFields = this.validFields.numericFields;

        // all fields
        const allPossibleFields = this.validFields.allFields;

        // convert each numeric('2') fields to numbers(2)
        for (const fieldName of numericFields) {
            if (Object.hasOwn(this.query, fieldName))
                this.normalizeQueryFilters(fieldName)
        }

        // check for array fields like.  
        // 'category=food&category=bill'(category =['food', 'bill])
        
        for (const fieldName of allPossibleFields) {
            const queryFieldValue = this.query[fieldName];

            if (Array.isArray(queryFieldValue)) {
                // include '$in' oprator for arrays field 
                // like category =['food', 'bill] --> {category: {"$in": ['food','bill']}}
                this.query[fieldName] = { "$in": queryFieldValue };
            }
        }

        //add '$' before each operator like ('gt' -> '$gt')
        this.query = JSON.stringify(this.query)
            .replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);

            // parsing...
        this.query = JSON.parse(this.query);

        return this.query;
    }

    cleanUpQuery() {
        const allPossibleFields = this.validFields.allFields;

        // remove invalid document fields
        Object.keys(this.query).forEach(fieldName => {
            if (!allPossibleFields.has(fieldName)) {
                delete this.query[fieldName];
            }
        });

        // mongoDB methods
        const reservedQueryMethods = ['sort', 'limit', 'skip', 'populate', 'select'];

        // remove mongoDB methods like sort/limit so they don't interefere
        // with .find() logic
        for (const method of reservedQueryMethods) {
            if (this.query[method]) {
                delete this.query[method];
            }
        }
    }

    createSortFields() {
        if (this.sortBy !== '-createdAt') {
            const sortFieldSet = new Set(this.sortBy.split(','));

            // If 'createdAt' (ascending) is not included in the sort fields
            // it means the query does not prioritize results by creation time.
            if (!sortFieldSet.has('createdAt')) {
                // default fallback sort (descending)/ by latest order
                sortFieldSet.add('-createdAt');
            }

            // convert to a string
            this.sortBy = [...sortFieldSet].join(' ');
        }
    }

    createSelectFields() {
        const allFields = this.validFields.allFields
        if (this.selectedFields) {
            this.selectedFields = this.selectedFields.split(',');

            // filter valid fields
            this.selectedFields = this.selectedFields.filter(field =>

                // check if the field is for descending order like '-field' then it is valid
                allFields.has(field) || allFields.has(field.slice(1)))

            //set to null no fields are valid after filtering
            this.selectedFields = this.selectedFields.join(' ') || null;
        }
    }

    async execute() {

    }
}

export default QueryOpt;
