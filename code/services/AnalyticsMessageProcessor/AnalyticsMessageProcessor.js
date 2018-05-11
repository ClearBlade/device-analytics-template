/**
 * 
 * Triggered by inbound mqtt publish
 * 
 * Matches topic and payload against preconfigured Analytics
 * Creates AnalyticsEntries row for any point that breaches the rule.
 * 
 */
 function AnalyticsMessageProcessor(req, resp){
    ClearBlade.init({request:req})
    log(req)
    var config = {}
    activeRules=[]
    var messageToProcess = {}
    
    try{
        var parsedBody = JSON.parse(req.params.body)
        var messageToProcess = {
            body:parsedBody,
            topic:req.params.topic
        }
    }
    catch(e){
        var msg = "Invalid JSON found in message body: " + req.params.body
        log(msg); resp.error(msg)
    }
    
    getConfiguration().then(findRuleMatches).then(analyze).then(function(){
        log("Success")
        log(activeRules)
        resp.success(activeRules)
    }).catch(function(e){
        log("Failed to process: " + JSON.stringify(e))
        resp.error("Failed: " + JSON.stringify(e))
    })
    
    
    
    function getConfiguration(){
        var deferred = Q.defer()
        ClearBlade
            .Query({collectionName:"AnalyticsConfiguration"})
            .columns([])
            .fetch(function(err, data){
                if(err){
                    var msg = "Unable to fetch AnalyticsConfiguration: " + JSON.stringify(data)
                    log(msg);
                    deferred.reject(new Error(msg))
                }
                else{
                    data.DATA.forEach(function(e){
                        config[e.name] = e
                    })
                    log("Got configuration: " + JSON.stringify(config))
                    deferred.resolve(config)
                }
                
        })
        return deferred.promise;
        
    }
    
    function findRuleMatches(){
        log("#findRuleMatches")
        for(i in config){
            var topic = config[i].topic
            var regex = topicToRegex(topic)
            log({regex})
            var pass = messageToProcess.topic.match(regex)
            log({pass})
            if(pass){
                activeRules.push(config[i])
            }
        }
    }
    
    function topicToRegex(topic){
        var topic = escapeRegExp(topic)
        function escapeRegExp(str) {
          return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        }
        var regex = topic.replace(/\#/g,"*").replace(/\+/g,"*") // TODO enforce single level for +
        return new RegExp(regex)
    }
    
    function analyze(){
        log("analyze")
        log({activeRules})
        try{
            for(var i in activeRules){
                var rule = activeRules[i]
                if( ! verifyRule(rule) || ! verifyMessageKey(rule.message_key)){
                    continue;
                }
                var ruleAnalytics = ANALYTICS[rule.type]
                
                var value = messageToProcess.body[rule.message_key]
                var parameters = JSON.parse(rule.params)
                var triggered = ruleAnalytics.detectBreach(rule, parameters, value)
                ruleAnalytics.execute(rule, parameters, value)
            }
        }
        catch(e){
            resp.success("failed due to error thrown")
        }
    }
    
    function verifyRule(rule){
        if( ! (rule.type in ANALYTICS)){
            var msg = "Invalid rule type found, unable to analyze: " + JSON.stringify(rule)
            log(msg)
            return false
        }
        return true
    }
    
    function verifyMessageKey(key){
        if( ! (key in messageToProcess.body)){
            log("Message key not found in payload. Invalid rule type found, unable to analyze: " + JSON.stringify(rule))
            return false
        }
        return true
    }
}