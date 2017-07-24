//
//  HomeData.h
//  SmartDoor
//
//  Created by 朱攀峰 on 16/10/29.
//  Copyright © 2016年 朱攀峰. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface HomeData : NSObject

+ (HomeData *)shareInstance;

@property (nonatomic,strong)NSMutableArray *buttonArr;

@property (nonatomic,strong)NSMutableArray *doorArr;

@property (nonatomic,strong)NSMutableArray *roomArr;

@property (nonatomic,strong)NSArray *titleArr;

@property (nonatomic,strong)NSString *showName;

@property (nonatomic,strong)NSString *sipid;

@property (nonatomic,assign)BOOL isComing;

@property (nonatomic,strong)NSString *cadno;

@end
