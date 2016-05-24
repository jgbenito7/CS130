//
//  ViewController.swift
//  RescueHero
//
//  Created by David Scheibe on 4/22/16.
//  Copyright © 2016 David Scheibe. All rights reserved.
//

import UIKit
import Haneke

class ReportTableController: UITableViewController {
    var data = [Dictionary<String,AnyObject>]()
    var cellTypePass: String!
    var cellTimePass: String!
    var cellNotesPass: String!
    var cellImagePass: UIImage!
    var cellImageURLPass: String!
    
    
    
    override func  preferredStatusBarStyle()-> UIStatusBarStyle {
        return UIStatusBarStyle.LightContent
    }
    
    
    @IBAction func logout_btn(sender: AnyObject) {
        let defaults = NSUserDefaults.standardUserDefaults()
        defaults.removeObjectForKey("token")
        defaults.synchronize()
        self.performSegueWithIdentifier("logout_segue", sender: self)
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        self.refreshControl?.addTarget(self, action: "handleRefresh:", forControlEvents: UIControlEvents.ValueChanged)
        if(Reachability.isConnectedToNetwork()) {
            handleRefresh(self.refreshControl!)
        }
        //self.navigationController?.navigationBar.barTintColor = UIColor(red: 21, green: 40, blue: 129, alpha: 1)
        //self.navigationController?.navigationBar.translucent = false
        //self.tableView.backgroundView = UIImageView(image: UIImage(named: "gradient-bg"))
        let imageView = UIImageView(frame: CGRect(x: 0, y: 0, width: 120, height: 50))
        imageView.contentMode = .ScaleAspectFit
        let image = UIImage(named: "RescueHeroLogo")
        imageView.image = image
        navigationItem.titleView = imageView
        //self.navigationController?.navigationBar.translucent = false
        //self.navigationController?.setNavigationBarHidden(false, animated: true)
        //self.navigationController?.navigationBar.setBackgroundImage(UIImage(), forBarMetrics: UIBarMetrics.Default)
        //self.navigationController?.navigationBar.shadowImage = UIImage()
        //self.navigationController?.navigationBar.translucent = true
        
        
    }
    
    override func viewDidAppear(animated: Bool) {
        //self.performSegueWithIdentifier("goto_login", sender: self)
    }

    override func viewWillAppear(animated: Bool) {
        //self.navigationController?.setNavigationBarHidden(false, animated: true)
        self.navigationController?.navigationBar.barTintColor = UIColor(red: 21/255, green: 140/255, blue: 128/255, alpha: 1)
        self.navigationController?.navigationBar.alpha = 1;
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }


    
    func handleRefresh(refreshControl: UIRefreshControl) {
        if !Reachability.isConnectedToNetwork() {
            print("Can't connect")
        }  else {
            do {
                let url = NSURL(string: "https://www.rescuehero.org/reports")
                let data = NSData(contentsOfURL: url!)
                let json = try NSJSONSerialization.JSONObjectWithData(data!, options: .AllowFragments)
                readJSONObject(json as! [AnyObject])
                self.tableView.reloadData()
            } catch _ {
                _ = ""
            }
        }
        refreshControl.endRefreshing()
        
    }
    
    func readJSONObject(object: [AnyObject]) {
        print(object)
        data = object as! [Dictionary<String,AnyObject>];
    }
    
    // MARK: - Table View
    
    override func numberOfSectionsInTableView(tableView: UITableView) -> Int {
        return 1
    }
    
    override func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        
        return data.count;
    }
    
    override func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath) {
        let indexPath = tableView.indexPathForSelectedRow!
        let currentCell = (tableView.cellForRowAtIndexPath(indexPath))! as! ReportTableCell
        cellTypePass = currentCell.cellType.text
        cellTimePass = currentCell.cellTime.text
        cellImagePass = currentCell.cellImage.image
        cellNotesPass = currentCell.cellNotes.text
        cellImageURLPass = currentCell.cellImageURL
        performSegueWithIdentifier("segueToAnimal", sender: self)
        
    }
    
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        if (segue.identifier == "segueToAnimal"){
            let viewController = segue.destinationViewController as! AnimalVC
            viewController._cellType = cellTypePass
            viewController._cellNotes = cellNotesPass
            viewController._cellTime = cellTimePass
            viewController._cellURLImage = cellImageURLPass
        }
    }
    
    override func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier("Cell", forIndexPath: indexPath) as! ReportTableCell
        let obj = data[indexPath.row]
        print(obj)
//        cell.layer.cornerRadius = 10
//        cell.layer.borderColor = UIColor.init(red: 30/255, green: 30/255, blue: 30/255, alpha: 1).CGColor
//        cell.layer.borderWidth = 4
        cell.cellNotes.text = obj["notes"] as? String
        cell.cellNotes.numberOfLines = 2
        cell.cellNotes.lineBreakMode = NSLineBreakMode.ByWordWrapping
        cell.cellNotes.preferredMaxLayoutWidth = 300
        cell.cellType.text = obj["type"] as? String
        print(cell.cellType.text)
        let utime = obj["utime"] as! NSNumber
        let nsti_time = NSTimeInterval(utime.doubleValue)
        let date = NSDate(timeIntervalSince1970: nsti_time)
        
        var dateString = timeAgoSinceDate(date, numericDates: true)
        
        //var dateFormatter = NSDateFormatter()
        //dateFormatter.dateFormat = "MM-dd-yyyy HH:mm"
        
        
        //var dateString = dateFormatter.stringFromDate(date)
        cell.cellTime.text = dateString
        var url = "https://www.rescuehero.org/images/thumb/"
        let imageURLs = obj["files"] as? [String]
        if (imageURLs?.count > 0){
            url.appendContentsOf(imageURLs![0])
            cell.cellImage.hnk_setImageFromURL(NSURL(string: url)!)
            var fulluri = "https://www.rescuehero.org/images/"
            fulluri.appendContentsOf(imageURLs![0])
            cell.cellImageURL = fulluri
        }
        else
        {
            cell.cellImage.image = UIImage(named: "camera")
        }
        return cell
    }
    
    override func tableView(tableView: UITableView, canEditRowAtIndexPath indexPath: NSIndexPath) -> Bool {
        // Return false if you do not want the specified item to be editable.
        return false
    }
    
    
    
    
    
    func timeAgoSinceDate(date:NSDate, numericDates:Bool) -> String {
        let calendar = NSCalendar.currentCalendar()
        let unitFlags:NSCalendarUnit = [.Minute, .Hour, .Day, .WeekOfYear, .Month, .Year, .Second]
        let now = NSDate()
        let earliest = now.earlierDate(date)
        let latest = (earliest == now) ? date : now
        let components:NSDateComponents = calendar.components(unitFlags, fromDate: earliest, toDate: latest,options:[])
        
        if (components.year >= 2) {
            return "\(components.year) years ago"
        } else if (components.year >= 1){
            if (numericDates){
                return "1 year ago"
            } else {
                return "Last year"
            }
        } else if (components.month >= 2) {
            return "\(components.month) months ago"
        } else if (components.month >= 1){
            if (numericDates){
                return "1 month ago"
            } else {
                return "Last month"
            }
        } else if (components.weekOfYear >= 2) {
            return "\(components.weekOfYear) weeks ago"
        } else if (components.weekOfYear >= 1){
            if (numericDates){
                return "1 week ago"
            } else {
                return "Last week"
            }
        } else if (components.day >= 2) {
            return "\(components.day) days ago"
        } else if (components.day >= 1){
            if (numericDates){
                return "1 day ago"
            } else {
                return "Yesterday"
            }
        } else if (components.hour >= 2) {
            return "\(components.hour) hours ago"
        } else if (components.hour >= 1){
            if (numericDates){
                return "1 hour ago"
            } else {
                return "An hour ago"
            }
        } else if (components.minute >= 2) {
            return "\(components.minute) minutes ago"
        } else if (components.minute >= 1){
            if (numericDates){
                return "1 minute ago"
            } else {
                return "A minute ago"
            }
        } else if (components.second >= 3) {
            return "\(components.second) seconds ago"
        } else {
            return "Just now"
        }
        
    }

}

