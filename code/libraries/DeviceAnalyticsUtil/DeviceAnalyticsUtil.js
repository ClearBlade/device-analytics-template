// TODO Frequency, range bound, variation, values
var ANALYTICS_COLLECTION = "AnalyticsEntries"
var ANALYTICS = {
    "upper_bound":{
        detectBreach:function(config, parameters, point){
            log("Running fn with " + config)
            return point > config.bound
        },
        execute:createBoundRow
    },
    "lower_bound":{
        detectBreach:function(config, parameters, point){
            log("Running fn with " + config)
            return point < config.bound
        },
        execute:createBoundRow
    }
};

function createBoundRow(config, parameters, point){
    log("Beginning execute")
    log(config)
    var val = typeof val === "String" ? point : new String(point)
    var row = {
        val,
        type:config.type,
        params:JSON.stringify(parameters),
        message_key:config.message_key,
        analytics_name:config.name,
        timestamp:new Date(),
    }
    log(row)
    try{
        ClearBlade.Collection({collectionName:ANALYTICS_COLLECTION}).create(row, function(err, data){
            if(err){
                log("Unable to create row in " + ANALYTICS_COLLECTION +": " + data)
            }
        })
    }catch(e){
        log("Failed to call collection: " + e)
    }
}