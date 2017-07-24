//
//  DoorDto.h
//  SmartDoor
//
//  Created by 朱攀峰 on 16/11/6.
//  Copyright © 2016年 朱攀峰. All rights reserved.
//

#import "CommonDTO.h"

@interface DoorDto : CommonDTO

@property (nonatomic,strong)NSMutableArray *dataArr;

@end

@interface DoorListDto : CommonDTO

@property (nonatomic,strong)NSMutableArray *dataArr;

@property (nonatomic,strong)NSString *dev_sn;//设备序列号
@property (nonatomic,strong)NSString *dev_mac;//设备 mac
@property (nonatomic,strong)NSString *dev_id;//设备 id(门 id 或者读头 id,和 dev_sn,dev_mac 一起确定具体哪个门)
@property (nonatomic,strong)NSString *show_name;//界面显示名称
@property (nonatomic,strong)NSMutableArray *readerArr;

@end

@interface DoorReaderDto : CommonDTO

@property (nonatomic,strong)NSString *reader_sn;//读头序列号
@property (nonatomic,strong)NSString *reader_mac;//读头 mac 地址
@property (nonatomic,strong)NSString *dev_type;//设备类型(1 读头,2 一体机,3 梯控)
@property (nonatomic,strong)NSString *network;//是否支持联网:0 否,1 是
@property (nonatomic,strong)NSString *privilege;//管理者权限(1 超级管理员,2 管理员, 4 普通用户),一体机使用
@property (nonatomic,strong)NSString *start_date;//开锁有效日期,永久为空值,格式:年月 日时分秒(yyyymmddHHMMSS)
@property (nonatomic,strong)NSString *end_date;//冻结日期,永久为空值,格式:年月日时 分秒(yyyymmddHHMMSS)
@property (nonatomic,strong)NSString *use_count;//使用次数
@property (nonatomic,strong)NSString *verified;//验证方式(1 有效期, 2 次数, 3 有效 期+次数)
@property (nonatomic,strong)NSString *open_type;//开锁方式(1 手机, 2 手机+卡,3 手机 +密码)
@property (nonatomic,strong)NSString *open_pwd;//开门密码
@property (nonatomic,strong)NSString *ekey;//用户电子钥匙
@property (nonatomic,strong)NSString *cardno;//离线梯控卡号,在线门禁梯控该字段值为 空,开门使用用户卡号
@property (nonatomic,strong)NSString *encryption;//是否加密:0 否,1 是
@property (nonatomic,strong)NSString *open_distance;
@property (nonatomic,assign)BOOL hasSearch; // 手机门管家列表，搜索排序；运行时动态刷新，不需要插入实际值
@property (nonatomic,assign)BOOL canUseShakeOpen; //是否禁止设备摇一摇开门（默认都允许）
@property (nonatomic,assign)BOOL canUseNearOpen; //是否禁止设备靠近开门（默认都允许）
@property (nonatomic) int shakeOpenDistance; //摇一摇距离，默认是-75
@property (nonatomic) int nearOpenDistance; //靠近开门，默认是-75

+(LibDevModel *) initLibDevModel:(DoorReaderDto *) devModel;
@end
