//
//  GlobalTool.h
//  DoorMaster
//
//  Created by 宏根 张 on 15/9/19.
//  Copyright (c) 2015年 zhiguo. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface GlobalTool : NSObject

/**
 * 为输入框增加左边的空白区域
 */
+ (void)addLeftViewForTextField:(UITextField *)textField;

//@property  (nonatomic, strong) NSString *cur_dev_sn; // 操作的门对象

/**
 * 为view增加圆角
 */
+ (void)addCornerForView:(UIView *)view;

+ (void) byteArrayPrint:(const char *)header andData: (Byte *)data andLen: (uint16_t) len;

+ (void) ntohl:(Byte[]) src andN:(int)n;

+(uint32_t *)getKey:(NSString*)commKey andData:(uint32_t *)data;

+ (NSString*)getPreferredLanguage;

+ (NSString*)getAccessToken;

// 国际化
+ (NSString*)getI18nLanguage;

// 设置缓存数据到dict中
+ (void)setGlobalDictValue:(NSString*)key andValue:(id)value;

// 从dict获取缓存数据
+ (NSString*)getGlobalDictValue:(NSString*)key;

// 提示操作结果
+ (void) alertTipsView:(NSString*)msg;

@end
