//
//  ViewController.swift
//  RescueHero
//
//  Created by David Scheibe on 4/22/16.
//  Copyright © 2016 David Scheibe. All rights reserved.
//

import UIKit

class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
    }
    
    override func viewDidAppear(animated: Bool) {
        self.performSegueWithIdentifier("goto_login", sender: self)
        
        
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    @IBAction func logOut(sender: UIButton) {
        self.performSegueWithIdentifier("goto_login", sender: self)
    }

}

