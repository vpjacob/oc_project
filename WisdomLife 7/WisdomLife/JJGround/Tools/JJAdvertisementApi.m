//
//  JJAdvertisementApi.m
//  WisdomLife
//
//  Created by 刘毅 on 2017/9/20.
//  Copyright © 2017年 wisdomlife. All rights reserved.
//

#import "JJAdvertisementApi.h"

@interface JJAdvertisementApi ()
@property (nonatomic, strong) NSString *ids;
@end

@implementation JJAdvertisementApi
//- (NSString *)requestUrl{
//    return @"http://192.168.1.199:9020/xk/appStartImg.do";
//}



//http://iosapi.itcast.cn/loveBeen/MyOrders.json.php
- (NSString *)requestUrl{
    return @"http://iosapi.itcast.cn/loveBeen/MyOrders.json.php";
}

- (id)requestArgument{
    NSDictionary *dict = @{
                           @"call":@"1"
                           };
    return dict;
}




////////////---------get  方法身份证
//- (YTKRequestMethod)requestMethod{
//    return 0;
//}
//
//- (NSString *)requestUrl{
//    return @"http://apis.juhe.cn/idcard/index";
//}
//
//- (instancetype)initWithID:(NSString *)ids{
//    if (self = [super init]) {
//        self.ids = ids;
//    }
//    return self;
//    
//}
//
//- (id)requestArgument{
//    NSDictionary *dict = @{
//                           @"cardno" : _ids,
//                           @"dtype" : @"json",
//                           @"key":@"ef3d90047e05f197f326551d469ccfa6"
//                           };
//    return dict;
//}

@end
