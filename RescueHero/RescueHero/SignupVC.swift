//
//  SignupVC.swift
//  RescueHero
//
//  Created by David Scheibe on 4/25/16.
//  Copyright © 2016 David Scheibe. All rights reserved.
//

import UIKit

class SignupVC: UIViewController {

    @IBOutlet weak var email_txt: UITextField!
    @IBOutlet weak var password_txt: UITextField!
    @IBOutlet weak var passconfirm_txt: UITextField!
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }

    @IBAction func signup_tapped(sender: AnyObject) {
    }
    @IBAction func noAccount_tapped(sender: AnyObject) {
        self.dismissViewControllerAnimated(true, completion: nil)
    }
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
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
