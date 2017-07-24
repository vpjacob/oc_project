//
//  CommonDTO.h
//  Storm
//
//  Created by 朱攀峰 on 15/11/26.
//  Copyright (c) 2015年 MCDS. All rights reserved.
//

#import <Foundation/Foundation.h>
SN_EXTERN id DMEncodeObjectFromDic(NSDictionary *dic, NSString *key);
SN_EXTERN NSString* DMEncodeStringFromDic(NSDictionary *dic,NSString *key);
SN_EXTERN NSNumber* DMEncodeNumberFromDic(NSDictionary *dic,NSString *key);
SN_EXTERN NSDictionary* DMEncodeDicFromDic(NSDictionary *dic,NSString *key);
SN_EXTERN NSArray* DMEncodeArrayFromDic(NSDictionary *dic,NSString *key);
@interface CommonDTO : NSObject

@property (nonatomic,assign)int type; //用于区分类型--Benson
@property (nonatomic,strong)NSString *sn;//SN序列号
@property (nonatomic,assign)int serialNumber; //排的序号

- (void)encodeFromDictionary:(NSDictionary *)dic;

+ (id)dtoFromDic:(NSDictionary *)dic;
@end
