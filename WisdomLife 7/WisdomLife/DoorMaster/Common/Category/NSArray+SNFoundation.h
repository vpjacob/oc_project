//
//  NSArray+SNFoundation.h
//  Storm
//
//  Created by 朱攀峰 on 15/12/3.
//  Copyright (c) 2015年 MCDS. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface NSArray (SNFoundation)

- (id)safeObjectAtIndex:(NSUInteger)index;

- (id)deepCopy;
- (id)mutableDeepCopy;

- (id)trueDeepCopy;
- (id)trueDeepMutableCopy;

@end


@interface NSMutableArray (CheckIndex)

- (void)safeReplaceObjectAtIndex:(NSUInteger)index withObject:(id)object;

@end

@interface NSMutableArray (WeakReferences)

+ (id)noRetainingArray;
+ (id)noRetainingArrayWithCapacity:(NSUInteger)capacity;
+ (id)arrayClass:(Class)name withCount:(int)count;

@end