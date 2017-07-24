
//
//  TypedefConstant.h
//  Storm
//
//  Created by 朱攀峰 on 15/12/4.
//  Copyright (c) 2015年 MCDS. All rights reserved.
//

typedef enum{
    DoorViewType  = 0,
    CallInType    = 1,
}CallType;


//typedef enum {
//    DEV_ACC_READER = 1, // 门禁读头
//    DEV_ACCESS = 2, // 门禁一体机
//    DEV_ELE_READER = 3, // 梯控读头
//    DEV_LOCK = 4, // 无线锁
//    DEV_BLUETOOTH_CONTROL = 5, // 蓝牙遥控模块
//    DEV_ACCESS_CONTROL = 6, // 门禁控制器
//    DEV_TOUCH_CONTROL = 7, // 触摸开关门禁
//    DEV_VIDEO = 8, // 可视对讲设备
//    DEV_QR_ACCESS = 9, // 二维码门禁
//}DevTypeE;

typedef enum {
    NOT_LIMIT = 0,
    VERY_CLOSE = 1,
    SHORT_DISTANCE = 2,
    MIDDLE_DISTANCE = 3,
}DistanceGroupE;

typedef enum {
    SUCCESS = 0, // 操作成功
    // 设备返回错误
    CRC_CHECK_ERROR = 0x01, // CRC校验错误
    COMM_FORMAT_ERROR = 0x02, // 通信命令格式错误
    DEV_MANAGE_PWD_ERROR = 0x03, // 设备管理密码错误
    DEV_ERROR_POWER = 0x04, // ERROR_POWER
    DATA_READ_WRITE_ERROR = 0x05, // 数据读写错误
    USER_NOT_IN_DEV = 0x06, // 用户未注册在设备中，即设备不存在电子钥匙所属超级用户
    RANDOM_CHECK_ERROR = 0x07, // 随机数检测错误
    GET_RANDOM_ERROR = 0x08, // 获取随机数错误
    COMM_CMD_LEN_ERROR = 0x09, // 命令长度不匹配
    NOT_ENTER_ADD_DEV_MODE = 0x0a, // 未进入添加设备模式
    DEVKEY_CHECK_ERROR = 0x0b, // devKey检测错误
    NOT_SUPPORT = 0x0c, // 功能不支持
    DEV_CAPACITY_SHORTAGE = 0x0d, // 设备容量不足
    // App 定义错误
    NO_CARDNO_ERROR = -1, // 用户没有卡号
    EMPTY_DEV_SN_ERROR = -2, // 序列号不能为空
    EMPTY_DEV_MAC_ERROR = -3, // mac 不能为空
    EMPTY_EKEY_ERROR = -4, // E-Key 电子钥匙不能为空
    DEV_TYPE_VALUE_ERROR = -5, // 设备类型值错误
    PRIVILEGE_VALUE_ERROR = -6, // 管理者权限值错误
    OPEN_MODE_VALUE_UNDEFINED = -7, // 开门方式值错误
    VERIFIED_VALUE_UNDEFINED = -8, // 验证方式值错误
    START_DATE_FORMAT_ERROR = -9, // 开始时间格式错误
    END_DATE_FORMAT_ERROR = -10, // 冻结时间格式错误
    EMPTY_USE_COUNT_ERROR = -11, // 使用次数不能为空
    OPERATION_VALUE_UNDEFINED = 12, // 值未定义
    OPERATION_FUNCTION_NOT_OPEN = -13, // operation其他功能未开放
    ILLEGAL_TIME = -14, // 非法开门时间，即不在有效期内开门
    PASS_THAN_OPEN_DISTANCE = -15, // 不在开门距离内
    WGFMT_ERROR = -16, // 韦根格式错误,当前仅支持26和34
    DRIVER_TIME_ERROR = -17, // 开门时长错误，仅支持1-254秒
    RELAY_SWITCH_ERROR = -18, // 电器开关设置错误，仅支持0电锁控制，1手动开关
    DEVICE_PWD_ERROR = -19, // 密码必须为6位数字
    EMPTY_CARD_ARRAY_ERROR = -20, // 卡号列表不能为空
    CARD_COUNT_PASS = -21, // 批量卡操作每次最多60张卡号
    
    BLUE_TOOTH_NOT_ENBLE = -101, // 蓝牙未开启
    NO_DEV_SN_ERROR = -102, // 指定的devSn不存在
    NO_CALLBACK_FUNCTION = -103, // 回调对象函数不存在
    OPEN_FAILURE = -104, // 开门失败
    OPEN_NOT_RESPONSE = -105, // 设备无响应
    DEVICE_NOT_NEAR = -106, // 设备不在附近
    BLUE_TOOTH_USING = -107, // 蓝牙正在操作，请等待
    SEC_VALUE_ERROR = -108, // sec 扫描时间单位错误
    SEC_SCAN_TIME_ERROR = -109, // 扫描时间超出范围
    DEV_HAS_SUPER_USER = -110, // 设备已存在超级用户，必须初始化设备才能添加设备
    DEV_MAC_VALUE_ERROR = -111, // MAC地址错误
}SDKRetE; // SDK返回值定义
