//
//  UIImageView+LBBlurredImage.h
//  LBBlurredImage
//
//  Created by Luca Bernardi on 11/11/12.
//  Copyright (c) 2012 Luca Bernardi. All rights reserved.
//

#import <UIKit/UIKit.h>

typedef void(^LBBlurredImageCompletionBlock)(NSError *error);

extern NSString *const kDMLBBlurredImageErrorDomain;

extern CGFloat   const kDMLBBlurredImageDefaultBlurRadius;

enum LBBlurredImageError
{
    LBBlurredImageErrorFilterNotAvailable = 0,
};


@interface UIImageView (LBBlurredImage)


/**
 Set the blurred version of the provided image to the UIImageView

 @param image      UIImage the image to blur and set as UIImageView's image
 @param blurRadius CGFLoat the radius of the blur used by the Gaussian filter
 @param completion LBBlurredImageCompletionBlock a completion block called after the image
 was blurred and set to the UIImageView (the block is dispatched on main thread)
 */
- (void)setImageToBlur: (UIImage *)image
            blurRadius: (CGFloat)blurRadius
       completionBlock: (LBBlurredImageCompletionBlock) completion;

@end
