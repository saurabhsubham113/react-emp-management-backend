function createResponse(error,data){
    const result = {}

    if (error) {
        result['status'] = 'error'
        result['data'] = error
    } else {
        result['status'] = 'success'
        result['data'] = data
    }

    return result
}
function nameFormatter(name){
    const fname = name.charAt(0).toUpperCase()
    const lname = name.substr(1,name.length).toLowerCase
    return fname+lname
}

module.exports = {
    createResponse,
    nameFormatter
}