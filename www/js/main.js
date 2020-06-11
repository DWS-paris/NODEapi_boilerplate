new FETCHrequest('/api/post', 'GET', null).sendRequest()
.then( apiResponse => {
    console.log(apiResponse)
})
.catch( apiResponse => {
    console.log(apiResponse)
})