//
//  AnimalVC.swift
//  RescueHero
//
//  Created by David Scheibe on 5/5/16.
//  Copyright © 2016 David Scheibe. All rights reserved.
//

import Foundation
import UIKit
import Haneke
import SwiftHTTP
import MapKit

class AnimalVC: UIViewController {
    var _cellType: String!
    var _cellTime: String!
    var _cellNotes: String!
    var _cellURLImage: String!
    var _cellStatus: String!
    var _cellId: Int!
    var _cellLat: Double!
    var _cellLong: Double!
    
    
    @IBOutlet weak var seg_select: UISegmentedControl!
    @IBOutlet weak var time: UILabel!
    @IBOutlet weak var image: UIImageView!
    
    @IBOutlet weak var get_directions: UIButton!
    @IBOutlet weak var type: UILabel!
    
    @IBOutlet weak var notes: UILabel!
    override func viewDidLoad() {
        image.hnk_setImageFromURL(NSURL(string: _cellURLImage)!)
        type.text = _cellType
        notes.text = _cellNotes
        time.text = _cellTime
        notes.numberOfLines = 0
        notes.lineBreakMode = NSLineBreakMode.ByWordWrapping
        notes.preferredMaxLayoutWidth = 300
        self.navigationController?.navigationBar.translucent = true
        
        
        navigationController!.navigationBar.titleTextAttributes =
            [NSForegroundColorAttributeName: UIColor.whiteColor()]
        
        //self.navigationController?.navigationBar.alpha = 1
        //self.navigationController?.navigationBar.barTintColor = UIColor(red: 210/255, green: 210/255, blue: 210/255, alpha: 1)
        
        seg_select.setTitleTextAttributes([NSForegroundColorAttributeName: UIColor.whiteColor()], forState: UIControlState.Selected)
        
        seg_select.layer.cornerRadius = 5.0;
        seg_select.layer.borderColor = UIColor.whiteColor().CGColor;
        seg_select.layer.borderWidth = 0;
        seg_select.layer.masksToBounds = true;
        
        get_directions.layer.cornerRadius = 5.0;

        
        print(_cellStatus)

        changeStatusStyle(_cellStatus)
        
        get_directions.layer.shadowColor = UIColor(red: 80/255, green: 80/255, blue: 80/255, alpha: 0.6).CGColor
        get_directions.layer.shadowOpacity = 1
        get_directions.layer.shadowOffset = CGSizeZero
        get_directions.layer.shadowRadius = 1
        
    }
    
    @IBAction func segmentChange(sender: AnyObject) {
        let current = sender.selectedSegmentIndex
        
        print(self._cellId)

        if(current==0){
            changeReportStatus("Active")
        }else if(current==1){
            changeReportStatus("OnTheWay")
        }else if(current==2){
            changeReportStatus("Rescued")
        }

        
    }
    
    
    @IBAction func backToTable(sender: AnyObject) {
        self.performSegueWithIdentifier("backToTable", sender: self)
    }
    
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        if (segue.identifier == "backToTable"){
            var viewController = segue.destinationViewController as! UINavigationController
            
        }
    }
    
    func changeReportStatus(status: String){
        let priority = DISPATCH_QUEUE_PRIORITY_DEFAULT
        dispatch_async(dispatch_get_global_queue(priority, 0)) {
            do{
                let defaults = NSUserDefaults.standardUserDefaults()
                let params = ["reportId":self._cellId,"status":status,"token":defaults.valueForKey("token")]
                let req = try HTTP.PUT("https://rescuehero.org/status", parameters: params)
                req.start { response in
                    if let err = response.error{
                        print("error: \(err.localizedDescription)")
                        return
                    }else{
                        print(response.data)
                        print(status)

                    }
                }
            }catch _{
            }
            
            
            dispatch_async(dispatch_get_main_queue()) {
                // update some UI
                if(status=="Active"){
                    self._cellStatus = "Active"
                    self.changeStatusStyle("Active")
                }else if(status=="OnTheWay"){
                    self._cellStatus = "On The Way"
                    self.changeStatusStyle("On The Way")
                }else if(status=="Rescued"){
                    self._cellStatus = "Rescued"
                    self.changeStatusStyle("Rescued")
                }
                
            }
        }
        
    }
    @IBAction func getDirections(sender: AnyObject) {
        //print(_cellLat)
        //print(_cellLong)
        
        openMapForPlace(self._cellLat, long: self._cellLong, name: "Animal Location")
    }
    
    func changeStatusStyle(status: String){
        if(status == "Active"){
            seg_select.selectedSegmentIndex = 0
            seg_select.tintColor = UIColor(red: 215/255, green: 60/255, blue: 10/255, alpha: 1)
            
            
        }else if(status == "On The Way"){
            seg_select.selectedSegmentIndex = 1
            seg_select.tintColor = UIColor(red: 232/255, green: 205/255, blue: 31/255, alpha: 1)
            
            
        }else if(status == "Rescued"){
            seg_select.selectedSegmentIndex = 2
            seg_select.tintColor = UIColor(red: 0/255, green: 201/255, blue: 52/255, alpha: 1)
        }
    }
    
    func openMapForPlace(lat:Double, long:Double, name:String) {

        
        let latitute:CLLocationDegrees =  lat
        let longitute:CLLocationDegrees =  long
        
        let regionDistance:CLLocationDistance = 10000
        let coordinates = CLLocationCoordinate2DMake(latitute, longitute)
        let regionSpan = MKCoordinateRegionMakeWithDistance(coordinates, regionDistance, regionDistance)
        let options = [
            MKLaunchOptionsMapCenterKey: NSValue(MKCoordinate: regionSpan.center),
            MKLaunchOptionsMapSpanKey: NSValue(MKCoordinateSpan: regionSpan.span)
        ]
        let placemark = MKPlacemark(coordinate: coordinates, addressDictionary: nil)
        let mapItem = MKMapItem(placemark: placemark)
        mapItem.name = "\(name)"
        mapItem.openInMapsWithLaunchOptions(options)
        
    }
    
}
