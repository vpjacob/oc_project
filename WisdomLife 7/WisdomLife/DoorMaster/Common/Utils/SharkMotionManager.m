//
//  SharkMotionManager.m
//  DoorMaster
//
//  Created by 宏根 张 on 6/29/16.
//  Copyright © 2016 zhiguo. All rights reserved.
//
// 摇一摇相关网址：
// http://blog.sina.com.cn/s/blog_68661bd80101cz8p.html
// http://zhidao.baidu.com/link?url=GSX2GjZ-kA0EufxaHRnG-Ee2rPoOTKV5RWqINZrwM-99oNjt-8D4gN-VkiXhuuSiGd2jOqj632TMno1czkiLSOipzsjVsjkJ0swP5AnYZZS
// http://blog.csdn.net/huanghuanghbc/article/details/9423979
// http://www.wjxfpf.com/2015/10/836742.html
// http://m.blog.csdn.net/blog/ejialin_11109/19511897

#import "SharkMotionManager.h"
#import <CoreMotion/CoreMotion.h>
#import "OptionManager.h"
#import "LxxPlaySound.h"

typedef enum _MotionDirection {UNKNOWDIRECTION=0,UP,DOWN}MotionDirection;

@interface SharkMotionManager()

@property (nonatomic,retain) CMMotionManager * motionManager;
@property (nonatomic,assign) MotionDirection motionDirection;
@property (nonatomic) Boolean hasStartShake; // 摇一摇是否已经启动

@end

@implementation SharkMotionManager

+ (instancetype)allocWithZone:(struct _NSZone *)zone
{
    static SharkMotionManager *instance = nil;
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

// 初始化
- (void)initMotionManager
{
    // 摇一摇功能
    self.hasStartShake = NO;
    self.motionManager = [[CMMotionManager alloc] init];//一般在viewDidLoad中进行
    self.motionManager.accelerometerUpdateInterval = .1;//加速仪更新频率，以秒为单位
    //注册监听摇一摇操作
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(startShakeMonitor) name:StartShakeMonitor object:nil];
}

// 启动摇一摇监听操作
- (void)startShakeMonitor
{
    //    DEBUG_PRINT(@"======Open door finish,startShakeMonitor=%d",self.hasStartShake);
    // 需判断是否重复启动
    if (self.hasStartShake == NO)
    {
        [self startAccelerometer];
    }
}

// 停止摇一摇监听
-(void)stopShakeMonitor
{
    _motionDirection = UNKNOWDIRECTION;
    [_motionManager stopAccelerometerUpdates];
    self.hasStartShake = NO;
}

//#ifdef YAOYAO
-(void)stopAccelerometerUpdates
{
    //停止加速仪更新（很重要！）
    //    NSLog(@"=====viewDidDisappear -stopAccelerometerUpdates");
    
    [self.motionManager stopAccelerometerUpdates];
}


-(void)startAccelerometer
{
    if ([[OptionManager manager] optionModel].useShake == YES)
    {
        self.hasStartShake = YES;
        //以push的方式更新并在block中接收加速度
        [self.motionManager startAccelerometerUpdatesToQueue:[[NSOperationQueue alloc]init] withHandler:^(CMAccelerometerData *accelerometerData, NSError *error) {
            [self outputAccelertionData:accelerometerData.acceleration];
            if (error)
            {
                NSLog(@"motion error:%@",error);
            }
        }];
    }
}

-(void)outputAccelertionData:(CMAcceleration)acceleration
{
    //综合3个方向的加速度
    double accelerameter =sqrt( pow( acceleration.x , 2 ) + pow( acceleration.y , 2 )
                               + pow( acceleration.z , 2) );
    //    NSLog(@"----accelerameter=%f", accelerameter);
    //当综合加速度大于2.3时，就激活效果（此数值根据需求可以调整，数据越小，用户摇动的动作就越小，越容易激活，反之加大难度，但不容易误触发）
    if (accelerameter>2.3f)
    {
        //立即停止更新加速仪（很重要！）
        [self stopShakeMonitor];
        dispatch_async(dispatch_get_main_queue(), ^{
            //UI线程必须在此block内执行，例如摇一摇动画、UIAlertView之类
            //            DEBUG_PRINT(@"=====检测到摇一摇开门");
            LxxPlaySound *playSound =[[LxxPlaySound alloc]initForPlayingVibrate];
            [playSound play];
            dispatch_async(dispatch_get_main_queue(), ^{
                [[NSNotificationCenter defaultCenter] postNotificationName:ScanOpenDoorReceved object:nil];
            });
            // 3秒后重新启动摇一摇
            dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW, 2000 * NSEC_PER_MSEC);
            dispatch_after(popTime, dispatch_get_main_queue(), ^{
                [self startShakeMonitor];
            });
        });
    }
}


// 备份，后续加上手势时使用
-(void)startMotion
{
    _motionDirection = UNKNOWDIRECTION;
    if(_motionManager.accelerometerAvailable)
    {
        NSOperationQueue *queue = [[NSOperationQueue alloc] init];
        _motionManager.accelerometerUpdateInterval = 1.0/60.0;
        
        __block float y = 0.0;
        __block int i = 0;
        [_motionManager startAccelerometerUpdatesToQueue:queue withHandler:^(CMAccelerometerData *accelerometerData, NSError *error) {
            if (error)
            {
//                DEBUG_PRINT(@"CoreMotion Error : %@",error);
                [_motionManager stopAccelerometerUpdates];
            }
            if(i == 0)
            {
                y = accelerometerData.acceleration.y;
            }
            i++;
            if(fabs(y - accelerometerData.acceleration.y) > 0.4)
            {
                if(y > accelerometerData.acceleration.y)
                {
//                    DEBUG_PRINT(@"UP");
                    _motionDirection = UP;
                }
                else
                {
//                    DEBUG_PRINT(@"Down");
                    _motionDirection = DOWN;
                }
                y = accelerometerData.acceleration.y;
            }
        }];
    }
    else
    {
//        DEBUG_PRINT(@"The accelerometer is unavailable");
    }
}

@end
