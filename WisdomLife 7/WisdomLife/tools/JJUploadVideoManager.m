//
//  JJUploadVideoManager.m
//  WisdomLife
//
//  Created by 刘毅 on 2017/7/21.
//  Copyright © 2017年 wisdomlife. All rights reserved.
//

#import "JJUploadVideoManager.h"
#import "AFHTTPSessionManager.h"

@implementation JJUploadVideoManager


+(instancetype)sharedManager{
    static JJUploadVideoManager *manager;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        manager = [[JJUploadVideoManager alloc] init];
    });
    return manager;
}


//-(void)upLoadVideo{
//    AFHTTPSessionManager *smr = [[AFHTTPSessionManager alloc] init];
//    [smr uploadTaskWithRequest: in fromData:<#(nullable NSData *)#> progress:^(NSProgress * _Nonnull uploadProgress) {
//        
//    } completionHandler:^(NSURLResponse * _Nonnull response, id  _Nullable responseObject, NSError * _Nullable error) {
//        
//    }];
//}

@end
