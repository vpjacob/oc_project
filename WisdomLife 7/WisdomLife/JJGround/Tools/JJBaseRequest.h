//
//  JJBaseRequest.h
//  DemoPro
//
//  Created by vpjacob on 2017/4/26.
//  Copyright © 2017年 vpjacob. All rights reserved.
//

#import "YTKNetwork.h"

@interface JJBaseRequest : YTKRequest
/**
 *  hud显示内容(如果成功后需要提示内容,勿使用此方法)
 */
@property (nonatomic, copy) NSString *hudString;

/**
 *  基本配置字典 配置 ver_num
 */
@property (nonatomic, strong) NSMutableDictionary *baseMuDic;

- (NSString *)getAppdingURLString:(NSString *)urlstring;

/**
 *  获取请求返回状态
 *
 *  @return 状态码
 */
- (NSInteger)getRequestStatuCode;

/**
 *  状态码是否是 200
 */
- (BOOL)statusCodeSuccess;

/**
 *  错误提示
 *
 *  @return 错误信息
 */
- (NSString *)errMessage;
@end
