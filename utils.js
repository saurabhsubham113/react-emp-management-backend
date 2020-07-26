function createResponse(error,data){
    const result = {}

    if (error) {
        result['status'] = 'error'
        result['error'] = error
    } else {
        result['status'] = 'success'
        result['data'] = data
    }

    return result
}
function nameFormatter(name='subham'){
    const fname = name.charAt(0).toUpperCase()
    const lname = name.substr(1,name.length).toLowerCase()
    return fname+lname
}

module.exports = {
    createResponse,
    nameFormatter
}