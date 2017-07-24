//
//  Config.h
//  Storm
//
//  Created by 朱攀峰 on 15/12/5.
//  Copyright (c) 2015年 MCDS. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface Config : NSObject
{
    NSUserDefaults *defaults;
}
+ (Config *)currentConfig;

-(void)setCallAccountDicWithArray:(NSArray *)accountArray;//配置呼叫白名单

@property (readwrite,retain)NSUserDefaults *defaults;

@property (nonatomic,readwrite,retain)NSString *client_id;



/**
 添加Model数据时[VoipDoorDto encodeWithCoder:]: unrecognized selector sent to instance
 而且启动APP时需要实例化？？
 解决方法：http://blog.csdn.net/struggle208/article/details/41120683
 */
@property (nonatomic,readwrite,retain)NSArray *voipDoorArr;

@property (nonatomic,readwrite,retain)NSString *phone;

@property (nonatomic,readwrite,retain)NSString *password;

@property (nonatomic,readwrite,retain)NSString *voipId;

@property (nonatomic,readwrite,retain)NSString *voipPsw;

@property (nonatomic,readwrite,retain)NSString *cardno;

-(void)clearSessionData;


@end
