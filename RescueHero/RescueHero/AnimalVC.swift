//
//  AnimalVC.swift
//  RescueHero
//
//  Created by David Scheibe on 5/5/16.
//  Copyright © 2016 David Scheibe. All rights reserved.
//

import Foundation
import UIKit

class AnimalVC: UIViewController {
    var _cellType: String!
    var _cellTime: String!
    var _cellNotes: String!
    var _cellImage: UIImage!
    
    @IBOutlet weak var time: UILabel!
    @IBOutlet weak var image: UIImageView!
    
    @IBOutlet weak var type: UILabel!
    
    @IBOutlet weak var notes: UILabel!
    override func viewDidLoad() {
        image.image = _cellImage
        type.text = _cellType
        notes.text = _cellNotes
        time.text = _cellTime
        notes.numberOfLines = 0
        notes.lineBreakMode = NSLineBreakMode.ByWordWrapping
        notes.preferredMaxLayoutWidth = 300
        let imageView = UIImageView(frame: CGRect(x: 0, y: 0, width: 120, height: 50))
        imageView.contentMode = .ScaleAspectFit
        let image_logo = UIImage(named: "RescueHeroLogo")
        imageView.image = image_logo
        navigationItem.titleView = imageView
        self.navigationController?.navigationBar.setBackgroundImage(UIImage(), forBarMetrics: UIBarMetrics.Default)
        self.navigationController?.navigationBar.shadowImage = UIImage()
        self.navigationController?.navigationBar.translucent = true
    }
    
    @IBAction func backToTable(sender: AnyObject) {
        self.performSegueWithIdentifier("backToTable", sender: self)
    }
    
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        if (segue.identifier == "backToTable"){
            var viewController = segue.destinationViewController as! ReportTableController
            
        }
    }
}
