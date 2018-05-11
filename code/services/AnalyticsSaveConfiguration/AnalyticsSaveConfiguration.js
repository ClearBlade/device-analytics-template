function AnalyticsSaveConfiguration(req, resp){
    log(req)
    ClearBlade.init({request:req})
    var changes = req.params
    ClearBlade.Query({collectionName:"AnalyticsConfiguration"}).equalTo("name",changes.name).update(changes, callback)
    
    function callback(err, data){
        if(err){
            var msg = "Unable to update AnalyticsConfiguration: " + JSON.stringify(data)
            log(msg); resp.error(msg)
        }
        log(data)
        resp.success("Successful updated " + changes.name)
    }
}