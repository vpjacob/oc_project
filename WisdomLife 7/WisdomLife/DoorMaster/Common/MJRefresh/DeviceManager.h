//
//  DeviceManager.h
//  SmartDoor
//
//  Created by 宏根 张 on 17/03/2017.
//  Copyright © 2017 朱攀峰. All rights reserved.
//

#import <Foundation/Foundation.h>

@class DoorListDto;
@class VoipDoorDto;

@interface DeviceManager : NSObject

@property (nonatomic, strong) NSMutableArray *list;//设备列表
@property (nonatomic, strong) NSMutableArray *tmpList;//临时设备列表
+ (instancetype)manager;

-(void)updataOnlineDeviceNotSort:(NSMutableDictionary *)devDict; //更新附近存在的门禁设备，不让扫描到的设备排在前面
-(void)updataOnlineDevice:(NSMutableDictionary *)devDict;//更新附近存在的门禁设备
-(DoorListDto *)getDeviceWithSn:(NSString *)dev_sn;
-(VoipDoorDto *)getVoipDeviceWithSn:(NSString *)dev_sn;
- (void) delDoorWithKey:(NSString*) devSn andDevMac:(NSString*) devMac;//删除设备
-(void)updateDoorName:(NSString *)devSn andMac:(NSString *)devMac name:(NSString *)name; //更换门禁设备名称
-(void)updateVoipDoorName:(NSString *)devSn name:(NSString *)name; //更换门口机设备名称
-(NSMutableArray *)getAllAccessDevice; //获取所有门禁设备
-(NSMutableArray *)getAllVoipDevice; //获取所有视频设备
-(BOOL)saveDevList;
-(void)updateAllLocalDeviceList; //更新本地设备列表:只用于登录成功后的更新设备列表
-(void)setDeviceSerialNumber; //重置序号
-(BOOL)containDeviceSn:(NSString *)devSn andType:(int)type getPosition:(int *)position; //根据devSn和type判断设备是否存在,若存在，则传出position
- (void)clearSessionData; // 退出登录，清理session数据，退出登录主动调用
-(BOOL)hasShakeDevice; //是否有设备开启了摇一摇功能
-(BOOL)hasNearOpenDevice; //是否有设备开启了靠近开门功能
@end
