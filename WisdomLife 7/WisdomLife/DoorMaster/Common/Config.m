//
//  Config.m
//  Storm
//
//  Created by 朱攀峰 on 15/12/5.
//  Copyright (c) 2015年 MCDS. All rights reserved.
//

#import "Config.h"
#import "LoginDto.h"

@implementation Config

@synthesize defaults;
@dynamic client_id;
@dynamic voipDoorArr;
@dynamic phone;
@dynamic password;
@dynamic voipId;
@dynamic voipPsw;
@dynamic cardno;

- (instancetype)init
{
    if (!(self = [super init])) {
       return self;
    }
    self.defaults = [NSUserDefaults standardUserDefaults];
    [self.defaults registerDefaults:[NSDictionary dictionaryWithObjectsAndKeys:
                                     @"",NSStringFromSelector(@selector(client_id)),
                                     @"",NSStringFromSelector(@selector(voipDoorArr)),
                                     @"",NSStringFromSelector(@selector(phone)),
                                     @"",NSStringFromSelector(@selector(password)),
                                     @"",NSStringFromSelector(@selector(voipId)),
                                     @"",NSStringFromSelector(@selector(voipPsw)),
                                     @"",NSStringFromSelector(@selector(cardno)),
                                     nil]];
    return self;
    
}
- (void)dealloc
{
    self.defaults = nil;
    self.client_id = nil;
    self.voipDoorArr = nil;
    self.phone = nil;
    self.password = nil;
    self.voipId = nil;
    self.voipPsw = nil;
    self.cardno = nil;
    
}

+ (Config *)currentConfig
{
    static Config *currentConfig = nil;
    static dispatch_once_t oneToken;
    dispatch_once(&oneToken, ^{
        currentConfig = [[Config alloc] init];
    });
    return currentConfig;
}

-(void)setCallAccountDicWithArray:(NSArray *)accountArray
{
    NSMutableDictionary *accountDic = [NSMutableDictionary dictionary];
    for (VoipDoorDto *model in accountArray) {
        [accountDic setObject:model.dev_name forKey:model.dev_voip_account];
    }
    if (accountDic != nil && accountDic.count > 0) {
        [DMCommModel setCallAccountDict:accountDic intercept:YES];
    }
}

- (NSMethodSignature *)methodSignatureForSelector:(SEL)aSelector
{
    if ([NSStringFromSelector(aSelector) hasPrefix:@"set"]) {
        return [NSMethodSignature signatureWithObjCTypes:"v@:@"];
    }
    return [NSMethodSignature signatureWithObjCTypes:"@@:"];
}
- (void)forwardInvocation:(NSInvocation *)anInvocation
{
    NSString *selector = NSStringFromSelector(anInvocation.selector);
    if ([selector hasPrefix:@"set"]) {
        NSRange firstChar,rest;
        firstChar.location = 3;
        firstChar.length = 1;
        rest.location = 4;
        rest.length = selector.length-5;
        
        selector = [NSString stringWithFormat:@"%@%@",[[selector substringWithRange:firstChar] lowercaseString],[selector substringWithRange:rest]];
        
        __autoreleasing id value;
        [anInvocation getArgument:&value atIndex:2];
        
        if ([value isKindOfClass:[NSArray class]] || [value isKindOfClass:[NSSet class]]) {
            [self.defaults setObject:[NSKeyedArchiver archivedDataWithRootObject:value] forKey:selector];
        }
        else
        {
            [self.defaults setObject:value forKey:selector];
        }
    }
    else
    {
        __autoreleasing id value = [self.defaults objectForKey:selector];
        if ([value isKindOfClass:[NSData class]]) {
            value = [NSKeyedUnarchiver unarchiveObjectWithData:value];
        }
        [anInvocation setReturnValue:&value];
    }
}

-(void)clearSessionData
{
    self.password = nil;
    self.client_id = nil;
    self.voipId = nil;
    self.voipPsw = nil;
}

@end
