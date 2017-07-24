//
//  UploadOpenDoorService.h
//  SmartDoor
//
//  Created by 朱攀峰 on 16/12/4.
//  Copyright © 2016年 朱攀峰. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "OpenDoorDto.h"

@protocol UploadOpenDoorServiceDelegate <NSObject>

- (void)getOpenDoorRecordRequestInfoItem:(BOOL)isSuccess
                                    list:(NSMutableArray *)list
                                errorMsg:(NSString *)errorMsg;

@end

@interface UploadOpenDoorService : NSObject

@property (nonatomic,weak)id<UploadOpenDoorServiceDelegate>delegate;

- (void)postOpenDoorRecordRequest:(NSMutableArray *)list;

- (void)getOpenDoorRecordRequest:(NSMutableDictionary *)dict;

@end
