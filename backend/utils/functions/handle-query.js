import QueryOperations from "../classes/query-operations.js";

// HANDLES QUERY STRINGS
function handleQuery(req, validFields) {
    // if no query is needed
    if (!Object.keys(req.query).length){
        let query = new QueryOperations({})
        req.filteredQuery = query
        return;
    }

    // extracting and reconstruting the query
    let query = new QueryOperations(req.query, validFields)

   //removes invalid fields 
   //and mongoose methods from query strings like sort, limit, etc.
    query.cleanUpQuery();

    //sets filter
    query.createFilter(); 

    //sets fields to be sorted 
    query.createSortFields(); 

    // sets selected fields
    query.createSelectFields();

    // query for mongoose
    req.filteredQuery = query
}

export default handleQuery;