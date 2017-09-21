//
//  JJBaseRequest.m
//  DemoPro
//
//  Created by vpjacob on 2017/4/26.
//  Copyright © 2017年 vpjacob. All rights reserved.
//

#import "JJBaseRequest.h"
//#import "JJBaseRequestAccessory.h"
#import "NSString+MD5.h"

@interface JJBaseRequest ()

@end

@implementation JJBaseRequest

- (instancetype)init {
    if (self = [super init]) {

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

//- (id)requestArgument {
//    return self.appendSecretDic;
//}

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
