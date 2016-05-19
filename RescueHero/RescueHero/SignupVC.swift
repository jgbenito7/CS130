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
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
    }

    @IBAction func signup_tapped(sender: AnyObject) {
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
                        signup_success = true
                        print("Request succeeded")
                    }
                }
            } catch let error {
                print("got an error creating the request: \(error)")
            }
        }else{
            print("Learn how to type, bitch.")
        }
        if (signup_success) {
            performSegueWithIdentifier("signup", sender: self)
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
            let viewController = segue.destinationViewController as! ReportTableController
        }
        else if (segue.identifier == "signuptologin"){
            let viewController = segue.destinationViewController as! LoginVC
        }
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
