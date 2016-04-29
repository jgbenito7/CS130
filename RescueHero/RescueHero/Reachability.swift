import Foundation
public class Reachability {
    
    class func isConnectedToNetwork()->Bool{
        
        var Status:Bool = false
        let url = NSURL(string: "https://google.com/")
        let request = NSMutableURLRequest(URL: url!)
        request.HTTPMethod = "HEAD"
        request.cachePolicy = NSURLRequestCachePolicy.ReloadIgnoringLocalAndRemoteCacheData
        request.timeoutInterval = 10.0
        
        var response: NSURLResponse?
        
        do {
            try NSURLConnection.sendSynchronousRequest(request, returningResponse: &response) as NSData?
        } catch _ {
            
        }
        if let httpResponse = response as? NSHTTPURLResponse {
            if httpResponse.statusCode == 200 {
                Status = true
            }
        }
        
        return Status
    }
    
    class func isConnectedToService()->Bool{
        
        var Status:Bool = false
        let url = NSURL(string: "http://52.34.135.82/waterusage/1")
        let request = NSMutableURLRequest(URL: url!)
        request.HTTPMethod = "GET"
        request.cachePolicy = NSURLRequestCachePolicy.ReloadIgnoringLocalAndRemoteCacheData
        request.timeoutInterval = 10.0
        
        var response: NSURLResponse?
        
        do {
            try NSURLConnection.sendSynchronousRequest(request, returningResponse: &response) as NSData?
        } catch _ {
            
        }
        if let httpResponse = response as? NSHTTPURLResponse {
            if httpResponse.statusCode == 200 {
                Status = true
                print("connected successfully")
            }
        }
        
        return Status
    }
    
}