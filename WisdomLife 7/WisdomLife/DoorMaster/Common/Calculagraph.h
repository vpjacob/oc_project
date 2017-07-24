//
//  Calculagraph.h
//  Storm
//
//  Created by 朱攀峰 on 15/12/7.
//  Copyright (c) 2015年 MCDS. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface Calculagraph : NSObject
{
  @private
    CGFloat time_;
    CGFloat timeOut_;
    NSTimer *timer_;
    BOOL _validate;
}

@property (nonatomic,assign)CGFloat time;

@property (nonatomic,assign)CGFloat timeOut;

- (CGFloat)seconds;

- (void)start;

- (void)stop;

- (BOOL)isValidate;
@end
