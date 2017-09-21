//
//  DeviceManager.m
//  SmartDoor
//
//  Created by 宏根 张 on 17/03/2017.
//  Copyright © 2017 朱攀峰. All rights reserved.
//

#import "DeviceManager.h"
#import "LoginDto.h"
#import "DoorDto.h"
#import "UserManager.h"

#define DEVICELISTUPDATENOTIFICATION @"devicelistupdatenotification"

@interface DeviceManager ()

@property (nonatomic, copy) NSString *devListFilePath;

@end

@implementation DeviceManager

+ (instancetype)allocWithZone:(struct _NSZone *)zone
{
    static DeviceManager *instance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        instance = [super allocWithZone:zone];
    });
    return instance;
}

+ (instancetype)manager
{
    return [[self alloc] init];
}

/**
 *  懒加载msgFilePath
 */

- (NSString *)devListFilePath
{
    if (_devListFilePath == nil)
    {
        if ([[UserManager manager] user].identity != nil)
        {
            NSString *msgFile = [[[UserManager manager] user].identity stringByAppendingString:@"_devList"];
            _devListFilePath = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES)[0] stringByAppendingPathComponent:msgFile];
        }
    }
    return _devListFilePath;
}

-(NSMutableArray *)list
{
    if (_list == nil) {
        if (self.devListFilePath == nil) {
            return nil;
        }
        _list = [NSKeyedUnarchiver unarchiveObjectWithFile:self.devListFilePath];
        if (_list == nil) {
            _list = [NSMutableArray array];
        }
    }
    return _list;
}

//存放临时设备列表，
-(NSMutableArray *)tmpList
{
    if (!_tmpList) {
        _tmpList = [NSMutableArray array];
    }
    return _tmpList;
}

-(BOOL)saveDevList
{
    if (self.devListFilePath == nil) {
        return NO;
    }
    return [NSKeyedArchiver archiveRootObject:_list toFile:self.devListFilePath];
}

- (void) delDoorWithKey:(NSString*) devSn andDevMac:(NSString*) devMac
{
    for (CommonDTO *comm in _list) {
        if (comm.type == ACCESS_DEVICE) {
            DoorReaderDto *readDto = ((DoorListDto *)comm).readerArr.firstObject;
            if ([readDto.reader_sn isEqualToString:devSn] && [readDto.reader_mac isEqualToString:devMac]) {
                [_list removeObject:comm];
                break;
            }
        }else
        {
            if ([((VoipDoorDto *)comm).dev_sn isEqualToString:devSn]) {
                [_list removeObject:comm];
                break;
            }
        }
    }
}

-(void)updataOnlineDeviceNotSort:(NSMutableDictionary *)devDict
{
    NSArray *scanList = [devDict allKeys];
    for (CommonDTO *comm in _list) {
        if (comm.type == ACCESS_DEVICE) {
            DoorReaderDto *readDto = ((DoorListDto *)comm).readerArr.firstObject;
            if ([scanList containsObject:readDto.reader_sn]) {
                readDto.hasSearch = YES;
            }else
            {
                readDto.hasSearch = NO;
            }
        }
    }
}

-(void)updataOnlineDevice:(NSMutableDictionary *)devDict
{
    NSMutableArray *tmpArr = [NSMutableArray array];
    NSArray *scanList = [devDict allKeys];
    for (CommonDTO *comm in _list) {
        if (comm.type == ACCESS_DEVICE) {
            DoorReaderDto *readDto = ((DoorListDto *)comm).readerArr.firstObject;
            if ([scanList containsObject:readDto.reader_sn]) {
                readDto.hasSearch = YES;
                [tmpArr insertObject:comm atIndex:0];
            }else
            {
                readDto.hasSearch = NO;
                [tmpArr addObject:comm];
            }
        }else
        {
            [tmpArr addObject:comm];
        }
    }
    _list = tmpArr;
}

-(DoorListDto *)getDeviceWithSn:(NSString *)dev_sn
{
    DoorListDto *accessDev = nil;
    for (CommonDTO *comm in _list) {
        if (comm.type == ACCESS_DEVICE) {
            if ([((DoorListDto *)comm).dev_sn isEqualToString:dev_sn]) {
                accessDev = (DoorListDto *)comm;
            }
        }
    }
    return accessDev;
}

-(VoipDoorDto *)getVoipDeviceWithSn:(NSString *)dev_sn
{
    VoipDoorDto *dto = nil;
    for (CommonDTO *comm in _list) {
        if (comm.type == VOIP_DOOR) {
            if ([((VoipDoorDto *)comm).dev_sn isEqualToString:dev_sn]) {
                dto = (VoipDoorDto *)comm;
            }
        }
    }
    return dto;
}

-(void)updateDoorName:(NSString *)devSn andMac:(NSString *)devMac name:(NSString *)name
{
    for (CommonDTO *comm in self.list) {
        if (comm.type == ACCESS_DEVICE) {
            DoorReaderDto *readDto = ((DoorListDto *)comm).readerArr.firstObject;
            if ([readDto.reader_sn isEqualToString:devSn] && [readDto.reader_mac isEqualToString:devMac]) {
                ((DoorListDto *)comm).show_name = name;
            }
        }
    }
}

-(void)updateVoipDoorName:(NSString *)devSn name:(NSString *)name
{
    for (CommonDTO *comm in self.list) {
        if (comm.type == VOIP_DOOR) {
            VoipDoorDto *dto = (VoipDoorDto *)comm;
            if ([dto.dev_sn isEqualToString:devSn]) {
                dto.dev_name = name;
            }
        }
    }
}

-(NSMutableArray *)getAllAccessDevice
{
    NSMutableArray *allAccessDevice = [NSMutableArray array];
    for (CommonDTO *comm in self.list) {
        if (comm.type == ACCESS_DEVICE) {
            [allAccessDevice addObject:comm];
        }
    }
    return allAccessDevice;
}

-(NSMutableArray *)getAllVoipDevice
{
    NSMutableArray *allVoipDevice = [NSMutableArray array];
    for (CommonDTO *comm in self.list) {
        if (comm.type == VOIP_DOOR) {
            [allVoipDevice addObject:comm];
        }
    }
    return allVoipDevice;
}

//更新本地设备列表:只用于登录成功后的更新设备列表
-(void)updateAllLocalDeviceList
{
    if (self.list.count > 0) {
        //让原有的设备保存原来的序号
        for (CommonDTO *tmpCommDto in self.tmpList) {
            for (CommonDTO * commDto in self.list) {
                if ([commDto.sn isEqualToString:tmpCommDto.sn] && commDto.type == tmpCommDto.type) {//替换序号，摇一摇功能，靠近功能等数据
                    tmpCommDto.serialNumber = commDto.serialNumber;
                    if (commDto.type == ACCESS_DEVICE) {
                        DoorReaderDto *doorReadDto = ((DoorListDto *)tmpCommDto).readerArr.firstObject;
                        DoorReaderDto *commReadDto = ((DoorListDto *)commDto).readerArr.firstObject;
                        doorReadDto.canUseShakeOpen = commReadDto.canUseShakeOpen;
                        doorReadDto.canUseNearOpen = commReadDto.canUseNearOpen;
                        doorReadDto.shakeOpenDistance = commReadDto.shakeOpenDistance;
                        doorReadDto.nearOpenDistance = commReadDto.nearOpenDistance;
                    }
                }
            }
        }
        //通过序号排序
        [self sortBySerialNumber:self.tmpList];
    }
    self.list = [self.tmpList mutableCopy]; //替换列表
    [self setDeviceSerialNumber]; //重置序号
    [self saveDevList]; //保存列表
    //列表更新的通知
    [[NSNotificationCenter defaultCenter] postNotificationName:DevListMsgReceved object:nil];
}

-(void)sortBySerialNumber:(NSMutableArray *)deviceList
{
    for (int i = 0; i < deviceList.count; i++) {
        for (int j = 0; j < deviceList.count - i - 1; j++) {
            CommonDTO *firstDto = deviceList[j];
            CommonDTO *secondDto = deviceList[j+1];
            if (firstDto.serialNumber >= secondDto.serialNumber) {
                deviceList[j] = secondDto;
                deviceList[j+1] = firstDto;
            }
        }
    }
}

//重置序号
-(void)setDeviceSerialNumber
{
    for (int i = 0; i < self.list.count; i++) {
        CommonDTO *dto = self.list[i];
        dto.serialNumber = i;
    }
}

//根据devSn和type判断设备是否存在
-(BOOL)containDeviceSn:(NSString *)devSn andType:(int)type getPosition:(int *)position
{
    BOOL contain = NO;
    
    for (CommonDTO *dto in self.list) {
        if (dto.type == type && [dto.sn isEqualToString:devSn]) {
            *position = dto.serialNumber;
            return YES;
        }
    }
    return contain;
}

//是否有设备开启了摇一摇功能
-(BOOL)hasShakeDevice
{
    BOOL has = NO;
    for (CommonDTO *dto in self.list) {
        if (dto.type == ACCESS_DEVICE) {
            DoorReaderDto *readDto = ((DoorListDto *)dto).readerArr.firstObject;
            if (readDto.canUseShakeOpen) {
                return YES;
            }
        }
    }
    return has;
}

//是否有设备开启了靠近开门功能
-(BOOL)hasNearOpenDevice
{
    BOOL has = NO;
    for (CommonDTO *dto in self.list) {
        if (dto.type == ACCESS_DEVICE) {
            DoorReaderDto *readDto = ((DoorListDto *)dto).readerArr.firstObject;
            if (readDto.canUseNearOpen) {
                return YES;
            }
        }
    }
    return has;
}


// 退出登录，清理session数据，退出登录主动调用
- (void)clearSessionData
{
    self.devListFilePath = nil;
    [self.list removeAllObjects];
    self.list = nil;
}

@end
