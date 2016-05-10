//
//  ViewController.swift
//  RescueHero
//
//  Created by David Scheibe on 4/22/16.
//  Copyright © 2016 David Scheibe. All rights reserved.
//

import UIKit

class ReportTableController: UITableViewController {
    var data = [Dictionary<String,AnyObject>]()
    var cellTypePass: String!
    var cellTimePass: String!
    var cellNotesPass: String!
    var cellImagePass: UIImage!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        self.refreshControl?.addTarget(self, action: "handleRefresh:", forControlEvents: UIControlEvents.ValueChanged)
        if(Reachability.isConnectedToNetwork()) {
            handleRefresh(self.refreshControl!)
        }
    }
    
    override func viewDidAppear(animated: Bool) {
        //self.performSegueWithIdentifier("goto_login", sender: self)
        
        
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    @IBAction func logOut(sender: UIButton) {
        self.performSegueWithIdentifier("goto_login", sender: self)
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
        performSegueWithIdentifier("segueToAnimal", sender: self)
        
    }
    
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        if (segue.identifier == "segueToAnimal"){
            var viewController = segue.destinationViewController as! AnimalVC
            viewController._cellImage = cellImagePass
            viewController._cellType = cellTypePass
            viewController._cellNotes = cellNotesPass
            viewController._cellTime = cellTimePass
        }
    }
    
    override func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier("Cell", forIndexPath: indexPath) as! ReportTableCell
        let obj = data[indexPath.row]
        print(obj)
        cell.cellNotes.text = obj["notes"] as? String
        cell.cellNotes.numberOfLines = 2
        cell.cellNotes.lineBreakMode = NSLineBreakMode.ByWordWrapping
        cell.cellNotes.preferredMaxLayoutWidth = 300
        cell.cellType.text = obj["type"] as? String
        print(cell.cellType.text)
        cell.cellTime.text = obj["time"] as? String
        var url = "https://www.rescuehero.org/images/"
        let imageURLs = obj["files"] as? [String]
        if (imageURLs?.count > 0){
            url.appendContentsOf(imageURLs![0])
            let imageData = NSData(contentsOfURL: NSURL(string: url)!)
            cell.cellImage.image = UIImage(data: imageData!)
        }
        else
        {
            cell.cellImage.image = UIImage(named: "camera")
        }
        return cell
    }
    
    override func tableView(tableView: UITableView, canEditRowAtIndexPath indexPath: NSIndexPath) -> Bool {
        // Return false if you do not want the specified item to be editable.
        return true
    }

}

