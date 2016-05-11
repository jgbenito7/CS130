//
//  Animal.swift
//  RescueHero
//
//  Created by David Scheibe on 5/5/16.
//  Copyright © 2016 David Scheibe. All rights reserved.
//

import Foundation

class Animal {
    private var _type: String!
    private var _notes: String!
    private var _location: String!
    private var _time: NSDate!
    private var _imageURL: String!
    private var _animalID: String!
    
    var type: NSDate {
        return _time
    }
    var notes: String {
        return _notes
    }
    var location: String {
        return _location
    }
    var imageURL: String {
        return _imageURL
    }
    var time: NSDate {
        return _time
    }
    var id: String {
        return _animalID
    }
    
    init (animalID: String, dictionary: Dictionary<String, AnyObject>){
        
    }
}