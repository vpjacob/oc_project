//
//  GlobalTool.m
//  DoorMaster
//
//  Created by 宏根 张 on 15/9/19.
//  Copyright (c) 2015年 zhiguo. All rights reserved.
//

#import "GlobalTool.h"
#import <Foundation/Foundation.h>

static NSMutableDictionary *globalCacheDict;

@interface GlobalTool()

@end

@implementation GlobalTool

+ (void)addLeftViewForTextField:(UITextField *)textField
{
    textField.leftViewMode = UITextFieldViewModeAlways;
    textField.leftView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 10, textField.bounds.size.height)];
}

+ (void)addCornerForView:(UIView *)view
{
    [self addCornerForView:view radius:5.0f];
}

+ (void)addCornerForView:(UIView *)view radius:(CGFloat)radius;
{
    view.layer.cornerRadius = radius;
    view.clipsToBounds = YES;
}

+(void) byteArrayPrint:(const char *)header andData: (Byte *)data andLen: (uint16_t) len
{
    printf("%s:",header);
    for (uint16_t i=0; i<len ; i++)
    {
        printf(" 0x%x ",data[i]);
    }
    printf("\n");
}

+(void)debugLog:(const char*)file andLine: (unsigned int )line
{

}


+(void) ntohl:(Byte*) src andN:(int)n
{
    for (int j=0; j<n/4; j++)
    {
        for (int i=0; i<2; i++)
        {
            Byte tmp = src[j*4+i]  ;
            src[j*4+i] =  src[j*4+4-i-1];
            src[j*4+4-i-1] = tmp;
        }
    }
}

+(uint32_t *)getKey:(NSString*)commKey andData:(uint32_t *)data
{
    for (int i=0; i<=(commKey.length-8); i+=8)
    {
        NSString *tmp = [commKey substringWithRange:NSMakeRange(i, 8)];
        data[i/8] = (uint32_t)strtoul([tmp cStringUsingEncoding:NSASCIIStringEncoding], nil, 16);
//        [GlobalTool ntohl:(Byte *)&data[i/8] andN:sizeof(data[i/8])];
    }
    return data;
}

+ (NSString*)getPreferredLanguage

{
    
    NSUserDefaults * defaults = [NSUserDefaults standardUserDefaults];
    
    NSArray * allLanguages = [defaults objectForKey:@"AppleLanguages"];
    
    NSString * preferredLang = [allLanguages objectAtIndex:0];
    
//    DEBUG_PRINT(@"当前语言:%@", preferredLang);
    
    return preferredLang;
}

+ (NSString*)getI18nLanguage
{
    NSString *language = [GlobalTool getPreferredLanguage];
    if ([language rangeOfString:@"zh-"].location != NSNotFound)
    {
        language = @"zh-CN";
    }
    else
    {
        language = @"en";
    }
    return language;
}

+ (NSString*)getAccessToken
{
    NSString *accessToken = [[ContentUtils shareContentUtils] getAccessToken];// 智果accessToken
    BOOL isOEM = [ISOEM isEqual: @"YES"] ? YES : NO;
    if (isOEM)
    {
        if ([OEM_COMPANY isEqual: @"ZHIGUO"])
        {
            accessToken = @"9f78222b67503baL58be033c17fbc0dL8123091d97876c7caa371817";
        }
        else if ([OEM_COMPANY isEqual: @"ZHIGUO"])
        {
            
        }
    }
    return accessToken;
}

// 设置缓存数据到dict中
+ (void)setGlobalDictValue:(NSString*)key andValue:(id)value
{
    if (globalCacheDict == nil)
    {
        globalCacheDict = [[NSMutableDictionary alloc] init];
    }
    globalCacheDict[key] = value;
}

// 从dict获取缓存数据
+ (NSString*)getGlobalDictValue:(NSString*)key
{
    return globalCacheDict[key];
}

+ (void) alertTipsView:(NSString*)msg
{
    UIAlertView *alter = [[UIAlertView alloc] initWithTitle:NSLocalizedString(@"tips", @"") message:NSLocalizedString(msg, @"") delegate:nil cancelButtonTitle:NSLocalizedString(@"confirm", @"") otherButtonTitles:nil];
    [alter show];
}

@end
