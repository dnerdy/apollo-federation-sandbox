module.exports = {
    requestDidStart(requestContext) {
        console.log(`\
Operation:
    Query:     ${requestContext.request.query}
    Variables: ${JSON.stringify(requestContext.request.variables)}`)
    }
}
