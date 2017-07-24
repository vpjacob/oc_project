//
//  DMHtmlListener.h
//  WisdomLife
//
//  Created by 宏根 张 on 09/05/2017.
//  Copyright © 2017 wisdomlife. All rights reserved.
//

#import <Foundation/Foundation.h>
@class APIWidgetContainer;

@interface DMHtmlListener : NSObject

+(instancetype)manager;
-(APIWidgetContainer *)getAPIWidgetContainer;
- (void)nativeSendActionToH5:(NSString*)action;
@end
