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
                let url = NSURL(string: "http://54.186.47.42/reports")
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
    
    
    override func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier("Cell", forIndexPath: indexPath)
        let obj = data[indexPath.row]
        print(obj)
        cell.textLabel?.text = obj["notes"] as? String
        return cell
    }
    
    override func tableView(tableView: UITableView, canEditRowAtIndexPath indexPath: NSIndexPath) -> Bool {
        // Return false if you do not want the specified item to be editable.
        return true
    }

}

