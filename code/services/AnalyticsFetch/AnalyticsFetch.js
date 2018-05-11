/**
 * Fetches a subset of entries associated with one Analytics name
 * @parameter {string} name analytics name from AnalyticsConfiguration
 * 
 */
 function AnalyticsFetch(req, resp){
    ClearBlade.init({request:req})
    ClearBlade.Query({collectionName:"AnalyticsEntries"}).equalTo('analytics_name',req.params.name).fetch(callback)
    
    function callback(err, data){
        if(err){
            var msg = "Failed to fetch analytics: " + JSON.stringify(data)
            log(msg); resp.success(msg)
        }
        if( ! data.TOTAL){
            resp.success([])
        }
        resp.success(data.DATA)
    }
}