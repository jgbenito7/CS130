//
//  LoginVC.swift
//  RescueHero
//
//  Created by David Scheibe on 4/25/16.
//  Copyright © 2016 David Scheibe. All rights reserved.
//

import UIKit
import SwiftHTTP
import Foundation

class LoginVC: UIViewController {
    
    
    let application: UIApplication = UIApplication.sharedApplication()
    
    var keyboardUp = false
    func keyboardVisible(notif: NSNotification) {
        //print("keyboardVisible")
        if(!keyboardUp) {
            
            animateViewMoving(true, moveValue: 95)
            keyboardUp = true
        }
    }
    
    func keyboardHidden(notif: NSNotification) {
        //print("keyboardHidden")
        if(keyboardUp) {
            animateViewMoving(false, moveValue: 95)
            keyboardUp = false
        }
    }
    override func viewDidLoad() {
        super.viewDidLoad()
        NSNotificationCenter.defaultCenter().addObserver(self, selector: #selector(LoginVC.keyboardVisible(_:)), name: UIKeyboardDidShowNotification, object: nil)
        NSNotificationCenter.defaultCenter().addObserver(self, selector: #selector(LoginVC.keyboardHidden(_:)), name: UIKeyboardDidHideNotification, object: nil)
        self.hideKeyboardWhenTappedAround()
//        // Do any additional setup after loading the view.
        email_txt.addTarget(self, action: "textFieldDidBeginEditing:", forControlEvents: UIControlEvents.EditingDidBegin)
        email_txt.addTarget(self, action: "textFieldDidEndEditing:", forControlEvents: UIControlEvents.EditingDidEnd)
        password_txt.addTarget(self, action: "textFieldDidBeginEditing:", forControlEvents: UIControlEvents.EditingDidBegin)
        password_txt.addTarget(self, action: "textFieldDidEndEditing:", forControlEvents: UIControlEvents.EditingDidEnd)
        signin_button.layer.cornerRadius = 5;
        
        self.login_error.hidden = true
        
        
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override func viewDidAppear(animated: Bool) {


    }
    

    @IBOutlet weak var signin_button: UIButton!
    @IBOutlet weak var email_txt: UITextField!
    @IBOutlet weak var password_txt: UITextField!
    @IBAction func login_tapped(sender: UIButton) {

            let params = ["email": email_txt.text, "password": password_txt.text]
            do {
                let opt = try HTTP.POST("https://rescuehero.org/users/authorize", parameters: params)
                opt.start { response in
                    if let err = response.error{
                        print("Login unsuccessful")
                        dispatch_async(dispatch_get_main_queue()) {
                            self.login_error.hidden = false
                            //self.presentViewController(alertController, animated: true, completion: nil)
                        }
                        
                        //print("error: \(err.localizedDescription)")
                        //return
                    }else{

                        let jsonData: NSData = response.data
                        
                        do {
                            let jsonDict = try NSJSONSerialization.JSONObjectWithData(jsonData, options: NSJSONReadingOptions.MutableContainers) as! NSDictionary
                            let li = jsonDict["loggedIn"] as? Bool
                            
                            //Check if the login was successful
                            if(li != nil && li!){
                                let token = jsonDict["token"]!
                                
                                let defaults = NSUserDefaults.standardUserDefaults()
                                defaults.setValue(token, forKey: "token")
                                defaults.synchronize()
                                
                                if((defaults.valueForKey("apn_token")) != nil){
                                    //Save the apn token
                                    let params = ["userToken": token, "apnToken": defaults.valueForKey("apn_token")]
                                    let req = try HTTP.POST("https://rescuehero.org/apn", parameters: params)
                                    req.start { response in
                                        if let err = response.error{
                                            print("error: \(err.localizedDescription)")
                                            return
                                        }else{
                                            print(response.data)
                                            
                                        }
                                    }
                                    
                                }
                                
                                //Login Succeeded, Segue to table view
                                NSOperationQueue.mainQueue().addOperationWithBlock {
                                    self.performSegueWithIdentifier("signinwithtoken", sender: self)
                                }
                                
                                
                            }
                            else{
                                
                            }
                        } catch _ {
                            print("error1")
                        }
                        
                    }
                }
            } catch let error {
                print("error2")
                print("got an error creating the request: \(error)")
            }

    }
    @IBOutlet weak var login_error: UILabel!
    
    
    func textFieldDidBeginEditing(textField: UITextField) {
        if(textField.text == ""){
            textField.placeholder = nil;
        }
        textField.tintColor = UIColor.init(red: 80/255, green: 80/255, blue: 80/255, alpha: 0.7)
    }
    func textFieldDidEndEditing(textField: UITextField) {
        if(textField.text == ""){
            if textField.tag == 1{
                textField.placeholder = "Email"
            }else if textField.tag==2{
                textField.placeholder = "Password"
            }
        }
        
    }
    
    func animateViewMoving (up:Bool, moveValue :CGFloat){
        dispatch_async(dispatch_get_main_queue()) {
            var movementDuration:NSTimeInterval = 0.3
            var movement:CGFloat = ( up ? -moveValue : moveValue)
            UIView.beginAnimations( "animateView", context: nil)
            UIView.setAnimationBeginsFromCurrentState(true)
            UIView.setAnimationDuration(movementDuration )
            self.view.frame = CGRectOffset(self.view.frame, 0,  movement)
            UIView.commitAnimations()
        }
        
    }
    
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        
            if (segue.identifier == "signin" || segue.identifier == "signinwithtoken"){
                let viewController = segue.destinationViewController as! UINavigationController
            }
            else if (segue.identifier == "signintologin"){
                let viewController = segue.destinationViewController as! LoginVC
            }
        
    }
    


}
