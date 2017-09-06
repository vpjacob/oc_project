//
//  ZHFetchThread.m
//  RunLoopDemo
//
//  Created by 吴志和 on 15/11/27.
//  Copyright © 2015年 wuzhihe. All rights reserved.
//

#import "ZHFetchThread.h"

static ZHFetchThread *fetchThread = nil;

@implementation ZHFetchThread

+ (instancetype)fetchThread
{
    if (fetchThread == nil) {
        fetchThread = [[self alloc] initWithTarget:self selector:@selector(threadEntry) object:nil];
        fetchThread.name = @"ZHFetchThread";
        [fetchThread start];
    }
    return fetchThread;
}

+ (void)threadEntry
{
    NSRunLoop *runloop = [NSRunLoop currentRunLoop];
    [runloop addPort:[NSPort port] forMode:NSRunLoopCommonModes];
    [runloop run];
}

@end
