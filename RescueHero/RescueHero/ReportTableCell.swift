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
    
    @IBOutlet weak var cellNotes: UILabel!
    
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
    }
    
    @IBOutlet weak var cellTime: UILabel!
    
    @IBOutlet weak var cellImage: UIImageView!
    
    @IBOutlet weak var cellType: UILabel!
}
