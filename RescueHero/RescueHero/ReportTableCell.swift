//
//  ReportTableCell.swift
//  RescueHero
//
//  Created by Jacob Moghtader on 4/29/16.
//  Copyright © 2016 David Scheibe. All rights reserved.
//

import Foundation
import UIKit

class ReportTableCell: UITableViewCell {
    
    @IBOutlet weak var table_cell: UIView!
    
    
    
    @IBOutlet weak var cellNotes: UILabel!
    var cellImageURL: String
    required init?(coder aDecoder: NSCoder) {
        cellImageURL = String("")
        super.init(coder: aDecoder)
    }
    
    @IBOutlet weak var cellTime: UILabel!
    
    @IBOutlet weak var cellImage: UIImageView!
    
    @IBOutlet weak var cellType: UILabel!
}
