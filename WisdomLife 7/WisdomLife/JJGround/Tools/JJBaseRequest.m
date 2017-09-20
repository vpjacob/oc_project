//
//  JJBaseRequest.m
//  WisdomLife
//
//  Created by 刘毅 on 2017/9/20.
//  Copyright © 2017年 wisdomlife. All rights reserved.
//

#import "JJBaseRequest.h"
//#import "JJBaseRequestAccessory.h"


@interface JJBaseRequest ()
//@property (nonatomic, strong) JJBaseRequestAccessory *accessory;
@end

@implementation JJBaseRequest


- (instancetype)init {
    if (self = [super init]) {
//        [self addAccessory:self.accessory];
    }
    return self;
}

#pragma mark - YTKRequest Configure
- (NSTimeInterval)requestTimeoutInterval {
    return 20;
}

- (YTKRequestMethod)requestMethod {
    return YTKRequestMethodPOST;
}

- (YTKRequestSerializerType)requestSerializerType {
    return YTKRequestSerializerTypeHTTP;
}


#pragma mark - Getter & Setter
- (NSMutableDictionary *)baseMuDic {
    if (!_baseMuDic) {
        NSDictionary *dic = @{
                              };
        _baseMuDic = [NSMutableDictionary dictionary];
        [_baseMuDic addEntriesFromDictionary:dic];
    }
    return _baseMuDic;
}


#pragma mark - Private Method
- (NSInteger)getRequestStatuCode {
    NSDictionary *jsonDic = self.responseJSONObject;
    return [[jsonDic objectForKey:@"code"] integerValue];
}

- (BOOL)statusCodeSuccess {
    return [self getRequestStatuCode] == 200;
}

- (NSString *)errMessage {
    NSDictionary *jsonDic = self.responseJSONObject;
    return [jsonDic objectForKey:@"msg"];
}



+ (BOOL)isNullString:(NSString *)str {
    return str.length == 0 || [str isKindOfClass:[NSNull class]];
}


@end
