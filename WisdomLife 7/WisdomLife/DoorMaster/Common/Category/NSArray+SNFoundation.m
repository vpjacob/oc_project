//
//  NSArray+SNFoundation.m
//  Storm
//
//  Created by 朱攀峰 on 15/12/3.
//  Copyright (c) 2015年 MCDS. All rights reserved.
//

#import "NSArray+SNFoundation.h"

@implementation NSArray (SNFoundation)

- (id)safeObjectAtIndex:(NSUInteger)index
{
    if (self.count > index) {
        return [self objectAtIndex:index];
    }
    return nil;
}

- (id)deepCopy
{
    return [[NSArray alloc] initWithArray:self copyItems:YES];
}
- (id)mutableDeepCopy
{
    return [[NSMutableArray alloc] initWithArray:self copyItems:YES];
}

- (id)trueDeepCopy
{
    return [NSKeyedUnarchiver unarchiveObjectWithData:[NSKeyedArchiver archivedDataWithRootObject:self]];
}
- (id)trueDeepMutableCopy
{
    return [[NSKeyedUnarchiver unarchiveObjectWithData:[NSKeyedArchiver archivedDataWithRootObject:self]] mutableCopy];
}
@end

@implementation NSMutableArray(CheckIndex)

- (void)safeReplaceObjectAtIndex:(NSUInteger)index withObject:(id)object
{
    if (self.count > index) {
        [self replaceObjectAtIndex:index withObject:object];
    }
}

@end


static const void * __TTRetainNoOp( CFAllocatorRef allocator , const void * value ){ return value;}
static void         __TTReleaseNoOp( CFAllocatorRef allocator , const void * value ){}

@implementation NSMutableArray (WeakReferences)

+ (id)noRetainingArray
{
    return [self noRetainingArrayWithCapacity:0];
}

+ (id)noRetainingArrayWithCapacity:(NSUInteger)capacity
{
    CFArrayCallBacks callBacks = kCFTypeArrayCallBacks;
    callBacks.retain = __TTRetainNoOp;
    callBacks.release = __TTReleaseNoOp;
    return (__bridge_transfer NSMutableArray *)CFArrayCreateMutable(nil, capacity, &callBacks);
}

+ (id)arrayClass:(Class)name withCount:(int)count
{
    NSMutableArray *array = [NSMutableArray new];
    for (int i = 0; i < count; i++) {
        [array addObject:[[name alloc] init]];
    }
    return array;
}
@end
