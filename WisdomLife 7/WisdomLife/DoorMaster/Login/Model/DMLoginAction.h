//
//  DMLoginAction.h
//  WisdomLife
//
//  Created by 宏根 张 on 07/06/2017.
//  Copyright © 2017 wisdomlife. All rights reserved.
//

#import <Foundation/Foundation.h>
@class APIWebView, APIScriptMessage;
@interface DMLoginAction : NSObject

+(void)loginWithUsername:(NSString *)username andPwd:(NSString *)pwd withWebView:(APIWebView *)webView andScriptMessage:(APIScriptMessage *)scriptMessage; //登录

+(void)logout;
@end
