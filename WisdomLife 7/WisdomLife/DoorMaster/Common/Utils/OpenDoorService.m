//
//  OpenDoorService.m
//  SmartDoor
//
//  Created by 宏根 张 on 17/03/2017.
//  Copyright © 2017 朱攀峰. All rights reserved.
//

#import "OpenDoorService.h"
#import "OptionManager.h"
#import "DeviceManager.h"
#import "DoorDto.h"
#import "MBProgressHUD.h"
#import "DevOpenLogManager.h"
#import <AVFoundation/AVFoundation.h>

@interface OpenDoorService ()<AVAudioPlayerDelegate>

@property (nonatomic, strong) NSDate *lastOperateTime; // 开门时的时间戳
@property (nonatomic) BOOL openSuccess;
@property (nonatomic, strong) NSMutableArray *accessDevice; //门禁设备
@property (nonatomic,assign)BOOL isPresentSheet;
@property (strong, nonatomic) MBProgressHUD *hud;
@property (nonatomic, strong) AVAudioPlayer * avAudioPlayer;
@property (nonatomic, strong) AVAudioSession *audioSession;
@property (nonatomic,strong)UploadOpenDoorService *openDoorService;

@property (nonatomic,strong) NSMutableDictionary *nearOpenDic; //记录靠近开门的设备即其开门时间

@end

@implementation OpenDoorService

static OpenDoorService *instance = nil;

+ (instancetype)allocWithZone:(struct _NSZone *)zone
{
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        instance = [super allocWithZone:zone];
        [instance addObserver];
        [instance initPlayOpenDoorSound];
        
    });
    
    return instance;
}

+ (instancetype)manager
{
    return [[self alloc] init];
}


+(void)startNearOpen
{
    [instance nearOpenDoorReceved];
}

-(void)addObserver
{
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(scanOpenDoorReceved:) name:ScanOpenDoorReceved object:nil]; // 注册扫描设备开门接口
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(openDoorReceved) name:OpenDoorReceved object:nil]; // 注册设备开门接口
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(nearOpenDoorReceved) name:NearOpenDoorReceved object:nil]; // 注册设备开门接口
}

-(void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

-(NSMutableDictionary *)nearOpenDic
{
    if (!_nearOpenDic) {
        _nearOpenDic = [NSMutableDictionary dictionary];
    }
    return _nearOpenDic;
}

-(void)clearNearOpenDeviceInfo
{
    self.nearOpenDic = nil;
}

// 扫描开门
- (void)scanOpenDoorReceved:(NSNotification *)notification
{
    int ret = [LibDevModel scanDevice:300];
    if (ret != SUCCESS)
    {
        NSString *errorCode = [NSString stringWithFormat:@"sdk_error_code%d", ret];
//        [MBProgressHUD showTip:NSLocalizedString(errorCode, @"")];
        [self presentSheet:NSLocalizedString(errorCode, @"")];
        return;
    }
//    MBProgressHUD *hud = [MBProgressHUD showMessage:NSLocalizedString(@"opening", @"")];
    [self displayOverFlowActivityView];
    [LibDevModel onScanOver:^(NSMutableDictionary *scanDevDict) {
        // 取出信号值有效的读头序列号
        if ([scanDevDict count] <= 0)
        {
//            [hud hide:YES afterDelay:0];
//            [MBProgressHUD showTip:NSLocalizedString(@"no_open_dev", @"")]; // 附近没有设备
            [self removeOverFlowActivityView];
            [self presentSheet:NSLocalizedString(@"no_open_dev", @"")];// 附近没有设备
            return;
        }
        // 开门设备序列号
        NSArray *rssiArray = [scanDevDict allValues];
        NSArray *rssiSortedArray= [rssiArray sortedArrayUsingSelector:@selector(compare:)]; // 排序，结果： [-96, -86, -66]
        NSString *devSn = nil;
        if (notification.object) {//如果是一键开门则object有值，否则为空值
            devSn = [self getOpenDevSn:rssiSortedArray andScanDict:scanDevDict andOpenType:1 andFrom:ONCE_OPEN];
        }else
        {
            devSn = [self getOpenDevSn:rssiSortedArray andScanDict:scanDevDict andOpenType:1 andFrom:SHAKE_OPEN];
        }
        if (devSn == nil)
        {
//            [hud hide:YES afterDelay:0];
//            [MBProgressHUD showTip:NSLocalizedString(@"far_away_dev", @"")]; // 有设备，但距离太远信号强度太弱
            [self removeOverFlowActivityView];
            [self presentSheet:NSLocalizedString(@"far_away_dev", @"")]; // 有设备，但距离太远信号强度太弱
            return;
        }
//        [hud hide:YES afterDelay:0];
        [self removeOverFlowActivityView];
        [self openDoor:devSn andOpenType:1];
    }];
}

// 启用靠近开门功能：蓝牙后台模式
-(void)nearOpenDoorReceved
{
    if ([[OptionManager manager] optionModel].useNearOpen == YES)
    {
        dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW, 1 * NSEC_PER_SEC); // 延时1秒启动
        dispatch_after(popTime, dispatch_get_main_queue(), ^{
            [LibDevModel startBackgroundMode];
            [LibDevModel onBGScanOver:^(NSMutableDictionary *scanDevDict) {
                // 取出信号值有效的读头序列号
                //                if ([scanDevDict count] <= 0)
                //                {
                //                    [MBProgressHUD showTip:NSLocalizedString(@"no_open_dev", @"")]; // 附近没有设备
                //                    return;
                //                }
                
                if (self.lastOperateTime != nil && self.openSuccess == NO)
                {
                    NSDate *curDate = [NSDate date]; // 当前时间
                    int timeInterval = [curDate timeIntervalSinceDate: self.lastOperateTime]; // 时间差
                    //                    NSLog(@"----click timeInterval=%d", timeInterval);
                    if (timeInterval <= 6) // 开门失败等6秒再执行靠近开门
                    {
                        return;
                    }
                }
                // 开门设备序列号
                NSArray *rssiArray = [scanDevDict allValues];
                NSArray *rssiSortedArray= [rssiArray sortedArrayUsingSelector:@selector(compare:)]; // 排序，结果： [-96, -86, -66]
                NSString *devSn = [self getOpenDevSn:rssiSortedArray andScanDict:scanDevDict andOpenType:2 andFrom:NEAR_OPEN];
                //                if (devSn == nil)
                //                {
                //                    [MBProgressHUD showTip:NSLocalizedString(@"far_away_dev", @"")]; // 有设备，但距离太远信号强度太弱
                //                    return;
                //                }
                [self openDoor:devSn andOpenType:2];
            }];
        });
    }
}

// 扫描回来的设备，取出权限内信号最强的设备序列号
-(NSString *)getOpenDevSn:(NSArray *)rssiArray andScanDict:(NSMutableDictionary *)scanDict andOpenType:(int)openType andFrom:(int)optionType
{
    int openDistance = 0;
    if (optionType == SHAKE_OPEN) {
        openDistance = [[OptionManager manager] optionModel].shakeOpenDistance;
    }else if(optionType == NEAR_OPEN){
        openDistance = [[OptionManager manager] optionModel].nearOpenDistance;
//        if (openDistance == NOT_LIMIT) {
//            openDistance = SHORT_DISTANCE; //默认靠近开门的距离为近距离
//        }
    }else
    {
        openDistance = -150; //一键开门没有限制
    }
    
    //    DEBUG_PRINT(@"==sharkOpenDistance:%d", sharkOpenDistance);
    long maxIndex = rssiArray.count - 1;
    for (long i = maxIndex; i >=0; i--)
    {
        for (NSString *key in scanDict)
        {
            
            if (scanDict[key] == rssiArray[i]) {
                DoorListDto *doorListDto = [[DeviceManager manager] getDeviceWithSn:key];
                
                if (optionType == SHAKE_OPEN) { //摇一摇开门
                    BOOL canUse = ((DoorReaderDto *)doorListDto.readerArr.firstObject).canUseShakeOpen;
                    if ([[ContentUtils shareContentUtils] isCube]) {
                        openDistance = ((DoorReaderDto *)doorListDto.readerArr.firstObject).shakeOpenDistance;
                    }
                    if (doorListDto != nil && canUse == YES) {
                        int curRssi = [rssiArray[i] intValue];
                        if (curRssi >= openDistance) {
                            return key;
                        }
                    }
                }else if(optionType == NEAR_OPEN) //靠近开门
                {
                    BOOL canUse = ((DoorReaderDto *)doorListDto.readerArr.firstObject).canUseNearOpen;
                    if ([[ContentUtils shareContentUtils] isCube]) { //云立方逻辑
                        openDistance = ((DoorReaderDto *)doorListDto.readerArr.firstObject).nearOpenDistance;
                    }else
                    {
                        if (canUse == YES && [[OptionManager manager] optionModel].nearOpenLimit && self.nearOpenDic[((DoorReaderDto *)doorListDto.readerArr.firstObject).reader_sn] != nil) {
                            NSDate *curDate = [NSDate date]; // 当前时间
                            int timeInterval = [curDate timeIntervalSinceDate: self.nearOpenDic[((DoorReaderDto *)doorListDto.readerArr.firstObject).reader_sn]]; // 时间差
                            if (timeInterval <= [[OptionManager manager] optionModel].nearOpenLimitInterval) // 间隔小于限制的时间间隔，则不开门
                            {
                                canUse = NO;
                            }
                        }
                    }
                    
                    if (doorListDto != nil && canUse == YES) {
                        int curRssi = [rssiArray[i] intValue];
                        if (curRssi >= openDistance) {
                            return key;
                        }
                    }
                }else //一键开门
                {
                    if (doorListDto != nil) {
                        int curRssi = [rssiArray[i] intValue];
                        if (curRssi >= openDistance) {
                            return key;
                        }
                    }
                }
            }
        }
    }
    return nil;
}

- (void)openDoor:(NSString *)devSn andOpenType:(int)openType
{
    
    DoorReaderDto *readerDto = nil;
    DoorListDto *dto = nil;
    self.lastOperateTime = [NSDate date]; // 点击开门时时间
//    DevModel *devModel = [[DevManager manager] getDevBySn:devSn];
    dto = [[DeviceManager manager] getDeviceWithSn:devSn];
    
    
    readerDto = dto.readerArr.firstObject;
    
    if (readerDto == nil)
    {
        if (openType == 1)
        {
            //            [MBProgressHUD showTip:NSLocalizedString(@"no_open_dev", @"")]; // 附近没有设备
            [self presentSheet:@"附近沒有設備"];
        }
        return;
    }
    
//    MBProgressHUD *hud = [MBProgressHUD showMessage:NSLocalizedString(@"opening", @"")];
    [self displayOverFlowActivityView];
    //    if (openType == 1)
    //    {
    //        hud = [MBProgressHUD showMessage:NSLocalizedString(@"opening", @"")];
    //    }
    // 调用sdk操作设备
    LibDevModel *libDevModel = [DoorReaderDto initLibDevModel:readerDto];
    
    if ([readerDto.dev_type intValue] == DEV_TYPE_RD100 || [readerDto.dev_type intValue] == DEV_TYPE_LC100 || [readerDto.dev_type intValue] == DEV_TYPE_QD100)
    {
        libDevModel.cardno = [Config currentConfig].cardno;
    }
    
    int ret = [LibDevModel controlDevice:libDevModel andOperation:0x00];
    if (ret != SUCCESS)
    {
        //        if (openType == 1)
        //        {
        [self removeOverFlowActivityView];
        NSString *errorCode = [NSString stringWithFormat:@"sdk_error_code%d", ret];
        [self presentSheet:NSLocalizedString(errorCode, @"")];
        //        }
        return;
    }
    [self playOpenDoorSound];
    [LibDevModel onControlOver:^(int ret, NSMutableDictionary *msgDict) {
        
        [self removeOverFlowActivityView];
        NSMutableDictionary *dict = [NSMutableDictionary dictionary];
        [dict setValue:dto.show_name forKey:@"dev_name"];
        [dict setValue:dto.dev_mac forKey:@"dev_mac"];
        [dict setValue:dto.dev_sn forKey:@"dev_sn"];
        [dict setValue:[NSNumber numberWithInt:1] forKey:@"comm_id"];
        [dict setValue:[CommonSystemInfo systemTimeInfo] forKey:@"event_time"];
        [dict setValue:[Config currentConfig].phone forKey:@"op_user"];
        [dict setValue:[NSNumber numberWithInt:1] forKey:@"event_type"];//接口文档里面没有
        [dict setValue:readerDto.cardno forKey:@"cardno"];//接口文档里面没有
        if (ret == SUCCESS)
        {
            if (openType == 2) { //靠近开门时，记录开门的设备和开门时间
                self.nearOpenDic[dto.dev_sn] = [NSDate date];
            }
            
            [self presentSheet:NSLocalizedString(@"open_door_success", @"")];
            
            [dict setValue:[NSNumber numberWithInt:5] forKey:@"action_time"];
            [dict setValue:[NSNumber numberWithInt:2] forKey:@"op_time"];
            [dict setValue:[NSNumber numberWithInt:0] forKey:@"op_ret"];
            
        }
        else
        {
            NSString *errorCode = [NSString stringWithFormat:@"sdk_error_code%d", ret];
            [self presentSheet:NSLocalizedString(errorCode, @"")];
            
            [dict setValue:[NSNumber numberWithInt:0] forKey:@"action_time"];
            [dict setValue:[NSNumber numberWithInt:0] forKey:@"op_time"];
            [dict setValue:[NSNumber numberWithInt:1] forKey:@"op_ret"];
        }
        
        //将开门记录保存到本地
        DevOpenLogModel *model = [[DevOpenLogModel alloc] init];
        [model initOpenLogWithDic:dict];
        [[DevOpenLogManager manager] addOpenLog:model];
        
        NSMutableArray *list = [NSMutableArray arrayWithObjects:dict, nil];
        [self.openDoorService postOpenDoorRecordRequest:list];
    }];
    
    
    
    
    
    
//    if (devModel.devType == DEV_TYPE_RD100 || devModel.devType == DEV_TYPE_LC100 || devModel.devType == DEV_TYPE_QD100)
//    {
//        NSString *cardno = [[DevManager manager] getCardnoWithDevSn:devModel.devSn];
//        libDevModel.cardno = cardno;
//    }
//    
//    int ret = [LibDevModel controlDevice:libDevModel andOperation:0x00];
//    if (ret != SUCCESS)
//    {
//        //        if (openType == 1)
//        //        {
//        [hud hide:YES afterDelay:0];
//        NSString *errorCode = [NSString stringWithFormat:@"sdk_error_code%d", ret];
//        [MBProgressHUD showTip:NSLocalizedString(errorCode, @"")];
//        //        }
//        return;
//    }
//    // 委托SDK执行回调函数
//    //    if (openType == 1)
//    //    {
//    [self playOpenDoorSound];
//    //    }
//    [LibDevModel onControlOver:^(int ret, NSMutableDictionary *msgDict) {
//        NSString *devName = [[DoorManager manager] getDevName:devSn];
//        //        if (openType == 1)
//        //        {
//        [hud hide:YES afterDelay:0];
//        if (ret == SUCCESS)
//        {
//            self.openSuccess = YES;
//            [MBProgressHUD showTip:[NSString stringWithFormat:@"%@ %@", devName == nil ? devSn : devName, NSLocalizedString(@"open_door_success", @"")]];
//            UserModel *user = [[UserManager manager] user];
//            user.defaultDoorName = devName;
//            [[UserManager manager] saveUser];
//            UINavigationController *navi = self.tabBarController.viewControllers[1];
//            [navi.topViewController.view setNeedsLayout];
//        }
//        else
//        {
//            self.openSuccess = NO;
//            NSString *errorCode = [NSString stringWithFormat:@"sdk_error_code%d", ret];
//            [MBProgressHUD showTip:[NSString stringWithFormat:@"%@ %@", devName == nil ? devSn : devName, NSLocalizedString(errorCode, @"")]];
//        }
//        DoorRunModel *doorRunModel = [[DoorRunManager manager] getDoorRunWithSn:devSn];
//        LockCell *cell = doorRunModel.cell;
//        if (cell != nil)
//        {
//            [cell updateImgAndStatus: ret == SUCCESS ? DEV_ONLINE : DEV_OFFLINE];
//        }
//        //        }
//        [ProcessDBData saveOpenLockEvent:libDevModel.devSn andDevMac:libDevModel.devMac andDevName:devName andEventType:1 andOpRet:ret == SUCCESS ? OP_SUCCESS : OP_FAILURE];
//    }];
}

- (void)presentSheet:(NSString *)title
{
    self.isPresentSheet = YES;
    [self removeOverFlowActivityView];
    MBProgressHUD *hud = [MBProgressHUD showHUDAddedTo:[UIApplication sharedApplication].keyWindow animated:YES];
    hud.mode = MBProgressHUDModeText;
    hud.labelText = title;
    hud.margin = 15.f;
    hud.yOffset = 00.f;
    hud.removeFromSuperViewOnHide = YES;
    [hud hide:YES afterDelay:3];
    
}

- (void)displayOverFlowActivityView
{
    self.isPresentSheet = NO;
    _hud = [MBProgressHUD showHUDAddedTo:[UIApplication sharedApplication].keyWindow animated:YES];
    _hud.mode = MBProgressHUDModeIndeterminate;
    _hud.margin = 20.f;
    _hud.yOffset = 30.f;
    _hud.opacity = 0.7;
    _hud.removeFromSuperViewOnHide = YES;
    
}
- (void)removeOverFlowActivityView
{
    [_hud hide:YES];
}

- (UploadOpenDoorService *)openDoorService
{
    if (!_openDoorService) {
        _openDoorService = [[UploadOpenDoorService alloc] init];
    }
    return _openDoorService;
}

// 初始化开门声音
- (void)initPlayOpenDoorSound
{
    NSString *string = nil;
    if ([[ContentUtils shareContentUtils] isCube]) { //云立方的开门声音
        string = [[NSBundle mainBundle] pathForResource:@"dooropen" ofType:@"mp3"];
    }else
    { //其他的开门声音
        string = [[NSBundle mainBundle] pathForResource:@"open_door_sound" ofType:@"wav"];
    }
    //把音频文件转换成url格式
    NSURL *url = [NSURL fileURLWithPath:string];
    self.audioSession = [AVAudioSession sharedInstance];
    [self.audioSession setCategory:AVAudioSessionCategoryPlayback error:nil];
    self.avAudioPlayer = [[AVAudioPlayer alloc] init];
    self.avAudioPlayer = [self.avAudioPlayer initWithContentsOfURL:url error:nil];
    //设置代理
    //        avAudioPlayer.delegate = self;
    //设置初始音量大小
    [self.avAudioPlayer setVolume:3.0];
    //设置音乐播放次数  -1为一直循环
    self.avAudioPlayer.numberOfLoops = 0;
}

// 播放开门声音
-(void)playOpenDoorSound
{
    [self.audioSession setActive:YES error:nil]; // 设置为YES，其他的播放类App如酷狗会中断
    [self.avAudioPlayer play];
}
// 代理开门声音session处理结果
- (void)audioPlayerDidFinishPlaying:(AVAudioPlayer *)player successfully:(BOOL)flag
{
    [self.audioSession setActive:NO error:nil];
}
- (void)audioPlayerDecodeErrorDidOccur:(AVAudioPlayer *)player error:(NSError *)error
{
    [self.audioSession setActive:NO error:nil];
}
- (void) audioPlayerBeginInterruption:(AVAudioPlayer *)player
{
    [self.audioSession setActive:NO error:nil];
}
- (void) audioPlayerEndInterruption:(AVAudioPlayer *)player withOptions:(NSUInteger)flags
{
    [self.audioSession setActive:NO error:nil];
}

@end
