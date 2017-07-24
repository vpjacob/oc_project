//
//  SplashView.swift
//  aircleaner
//
//  Created by Kooze on 16/7/7.
//  Copyright © 2016年 purisen. All rights reserved.
//

import UIKit

@objc class SplashView: UIView {
    
    // const
    static let IMG_URL = "splash_img_url"
    static let ACT_URL = "splash_act_url"
    static let IMG_PATH = String(format: "%@/Documents/splash_image.jpg", NSHomeDirectory())
    
    // in portrait mode
    let screenWidth = UIScreen.main.bounds.size.width
    let screenHeight = UIScreen.main.bounds.size.height
    let statusHeight = UIApplication.shared.statusBarFrame.height
    
    let buttonSize: CGFloat = 36.0
    let buttonSizeW: CGFloat = 60
    let buttonSizeH: CGFloat = 25
    let buttonMargin: CGFloat = 16.0
    
    var durationTime: Int = 6 {
        didSet {
            skipButton?.setTitle("跳过\(durationTime) s", for: UIControlState())
        }
    }
    
    // data
    var imageUrl: String?
    var actionUrl: String?
    var timer: Timer?
    
    var tapSplashImageBlock: ((_ actionUrl: String?) -> Void)?
    var splashViewDissmissBlock: ((_ initiativeDismiss: Bool) -> Void)?
    
    // views
    var imageView: UIImageView?
    var skipButton: UIButton?
    
    init() {
        super.init(frame: CGRect(x: 0, y: 0, width: screenWidth, height: screenHeight))
        initComponents()
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    // call this method at least in viewDidAppear func
    class func showSplashView(_ duration: Int = 6,
                              defaultImage: UIImage?,
                              tapSplashImageBlock: ((_ actionUrl: String?) -> Void)?,
                              splashViewDismissBlock: ((_ initiativeDismiss: Bool) -> Void)?) {
        if isExistsSplashData() {
            let splashView = SplashView()
            splashView.tapSplashImageBlock = tapSplashImageBlock
            splashView.splashViewDissmissBlock = splashViewDismissBlock
            splashView.durationTime = duration
            UIApplication.shared.delegate?.window!!.addSubview(splashView)
        } else if let _defaultImage = defaultImage {
            let splashView = SplashView()
            splashView.tapSplashImageBlock = tapSplashImageBlock
            splashView.splashViewDissmissBlock = splashViewDismissBlock
            splashView.durationTime = duration
            splashView.imageView?.image = _defaultImage
            UIApplication.shared.delegate?.window!!.addSubview(splashView)
        }
    }
    
    class func simpleShowSplashView() {
        showSplashView(defaultImage: nil, tapSplashImageBlock: nil, splashViewDismissBlock: nil)
    }
    
    func initComponents() {
        // init data
        imageUrl = UserDefaults.standard.value(forKey: SplashView.IMG_URL) as? String
        actionUrl = UserDefaults.standard.value(forKey: SplashView.ACT_URL) as? String
        
        // initViews
        self.backgroundColor = UIColor.white
        
        imageView = UIImageView(frame: CGRect(x: 0, y: 0, width: screenWidth, height: screenHeight))
        imageView?.isUserInteractionEnabled = true
        let recognize = UITapGestureRecognizer(target: self, action: #selector(tapImageAction))
        imageView?.addGestureRecognizer(recognize)
        imageView?.image = UIImage(contentsOfFile: SplashView.IMG_PATH)
        self.addSubview(imageView!)
        
        skipButton = UIButton(frame: CGRect(x: screenWidth - buttonSizeW - buttonMargin,
            y: buttonMargin + statusHeight, width: buttonSizeW, height: buttonSizeH))
        skipButton?.layer.cornerRadius = buttonSizeH / 2
        skipButton?.clipsToBounds = true
        skipButton?.backgroundColor = UIColor(red: 0.3, green: 0.3, blue: 0.3, alpha: 0.3)
        skipButton?.setTitleColor(UIColor.white, for: UIControlState())
        skipButton?.titleLabel?.font = UIFont.systemFont(ofSize: 14)
        skipButton?.titleLabel?.textAlignment = .center
        skipButton?.titleLabel?.numberOfLines = 1
        skipButton?.setTitle("跳过\(durationTime) s", for: UIControlState())
        skipButton?.addTarget(self, action: #selector(skipAction), for: .touchUpInside)
        self.addSubview(skipButton!)
        
        setupTimer()
    }
    
    func tapImageAction() {
        if let _tapSplashImageBlock = self.tapSplashImageBlock {
            self.skipAction()
            _tapSplashImageBlock(self.actionUrl)
        }
    }
    
    
    func skipAction() {
        dismissSplashView(true)
    }
    
    func setupTimer() {
        timer = Timer.scheduledTimer(timeInterval: 1.0,
                                                       target: self,
                                                       selector: #selector(timerCycleAction),
                                                       userInfo: nil,
                                                       repeats: true)
    }
    
    func stopTimer() {
        timer?.invalidate()
        timer = nil
    }
    
    func timerCycleAction() {
        if 0 == durationTime {
            dismissSplashView(false)
        } else {
            durationTime -= 1
        }
    }
    
    func dismissSplashView(_ initiativeDismiss: Bool) {
        
        stopTimer()
        UIView.animate(withDuration: 0.6,
                                   animations: {
                                    self.alpha = 0.0
                                    self.transform = CGAffineTransform(scaleX: 1.5, y: 1.5)
            },
                                   completion: {(finished) -> Void in
                                    self.removeFromSuperview()
                                    if let _splashViewDissmissBlock = self.splashViewDissmissBlock {
                                        _splashViewDissmissBlock(initiativeDismiss)
                                    }
        })
    }
    
    class func isExistsSplashData() -> Bool{
        let latestImgUrl = UserDefaults.standard.value(forKey: IMG_URL) as? String
        let isFileExists = FileManager.default.fileExists(atPath: IMG_PATH)
        
        return nil != latestImgUrl && isFileExists
    }
    
    class func updateSplashData(_ imgUrl: String?, actUrl: String?) {
        if nil == imgUrl {
            // no data
            return
        }
        
        UserDefaults.standard.setValue(imgUrl, forKey: IMG_URL)
        UserDefaults.standard.setValue(actUrl, forKey: ACT_URL)
        UserDefaults.standard.synchronize()
        
        DispatchQueue.global(priority: DispatchQueue.GlobalQueuePriority.background).async(execute: {
            let imageURL = URL(string: imgUrl!)
            if let _imageURL = imageURL {
                let data = try? Data(contentsOf: _imageURL)
                if let _data = data {
                    let image = UIImage(data: _data)
                    if let _image = image {
                        try? UIImagePNGRepresentation(_image)?.write(to: URL(fileURLWithPath: IMG_PATH), options: [.atomic])
                    }
                }
                
            }
        })
    }
}
