//
//  SignupVC.swift
//  RescueHero
//
//  Created by David Scheibe on 4/25/16.
//  Copyright © 2016 David Scheibe. All rights reserved.
//

import UIKit
import SwiftHTTP

class SignupVC: UIViewController {

    @IBOutlet weak var email_txt: UITextField!

    @IBOutlet weak var orgPassword_txt: UITextField!
    @IBOutlet weak var password_txt: UITextField!
    @IBOutlet weak var passconfirm_txt: UITextField!
    @IBOutlet weak var signup_button: UIButton!
    
    var keyboardUp = false
    func keyboardVisible(notif: NSNotification) {
        print("keyboardVisible")
        if(!keyboardUp) {
            animateViewMoving(true, moveValue: 130)
            keyboardUp = true
        }
    }
    
    func keyboardHidden(notif: NSNotification) {
        print("keyboardHidden")
        if(keyboardUp) {
            animateViewMoving(false, moveValue: 130)
            keyboardUp = false
        }
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.hideKeyboardWhenTappedAround()
        // Do any additional setup after loading the view.
        NSNotificationCenter.defaultCenter().addObserver(self, selector: #selector(LoginVC.keyboardVisible(_:)), name: UIKeyboardDidShowNotification, object: nil)
        NSNotificationCenter.defaultCenter().addObserver(self, selector: #selector(LoginVC.keyboardHidden(_:)), name: UIKeyboardDidHideNotification, object: nil)
        
        signup_button.layer.cornerRadius = 5;
        
    }

    @IBAction func signup_tapped(sender: AnyObject) {
        animateViewMoving(false, moveValue: 130)
        var signup_success = false
        if(password_txt.text == passconfirm_txt.text){
            let params = ["orgPassword": orgPassword_txt.text, "email": email_txt.text, "password": password_txt.text]
            do {
                let opt = try HTTP.POST("https://rescuehero.org/users", parameters: params)
                opt.start { response in
                    if let err = response.error{
                        print("error: \(err.localizedDescription)")
                        return
                    }else{
                        print("Request succeeded")
                        print(response.data)
                        var error: NSError?
                        let jsonData: NSData = response.data
                        
                        do {
                            let jsonDict = try NSJSONSerialization.JSONObjectWithData(jsonData, options: NSJSONReadingOptions.MutableContainers) as! NSDictionary
                            if((jsonDict["token"]) != nil){
                                let token = jsonDict["token"]!
                                
                                let defaults = NSUserDefaults.standardUserDefaults()
                                defaults.setValue(token, forKey: "token")
                                defaults.synchronize()
                                //Login Succeeded, Segue to table view
                                 NSOperationQueue.mainQueue().addOperationWithBlock {
                                    self.performSegueWithIdentifier("signup", sender: self)
                                }
                                
                                
                            }
                        } catch _ {
                            
                        }

                    }
                }
            } catch let error {
                print("got an error creating the request: \(error)")
            }
        }else{
            print("Learn how to type, bitch.")
        }
    }
    
    @IBAction func noAccount_tapped(sender: AnyObject) {
        self.dismissViewControllerAnimated(true, completion: nil)
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        if (segue.identifier == "signup"){
            let viewController = segue.destinationViewController as! UINavigationController
        }
        else if (segue.identifier == "signuptologin"){
            let viewController = segue.destinationViewController as! LoginVC
        }
    }
    
    
    
    func textFieldDidBeginEditing(textField: UITextField) {
        animateViewMoving(true, moveValue: 130)
        textField.placeholder = nil;
        textField.tintColor = UIColor.init(red: 80/255, green: 80/255, blue: 80/255, alpha: 0.7)
    }
    func textFieldDidEndEditing(textField: UITextField) {
        animateViewMoving(false, moveValue: 130)
        if(textField.text == ""){
            if textField.tag == 1{
                textField.placeholder = "Organization Password"
            }else if textField.tag==2{
                textField.placeholder = "Email"
            }else if textField.tag==3{
                textField.placeholder = "Password"
            }else if textField.tag==4{
                textField.placeholder = "Confirm Password"
            }
        }
        
    }
    
    func animateViewMoving (up:Bool, moveValue :CGFloat){
        var movementDuration:NSTimeInterval = 0.3
        var movement:CGFloat = ( up ? -moveValue : moveValue)
        UIView.beginAnimations( "animateView", context: nil)
        UIView.setAnimationBeginsFromCurrentState(true)
        UIView.setAnimationDuration(movementDuration )
        self.view.frame = CGRectOffset(self.view.frame, 0,  movement)
        UIView.commitAnimations()
    }

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}

// Put this piece of code anywhere you like
extension UIViewController {
    func hideKeyboardWhenTappedAround() {
        let tap: UITapGestureRecognizer = UITapGestureRecognizer(target: self, action: "dismissKeyboard")
        view.addGestureRecognizer(tap)
    }
    
    func dismissKeyboard() {
        view.endEditing(true)
    }
}
