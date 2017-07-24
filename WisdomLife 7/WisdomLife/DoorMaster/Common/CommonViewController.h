//
//  CommonViewController.h
//  Storm
//
//  Created by 朱攀峰 on 15/11/27.
//  Copyright (c) 2015年 MCDS. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "TPKeyboardAvoidingTableView.h"
#import "CommonNavBar.h"

@interface CommonViewController : UIViewController<UITableViewDataSource,UITableViewDelegate>
{
//    LinphoneChatRoom *chatRoom;
}
@property (nonatomic,strong)CommonNavBar *commonNavBar;

@property (nonatomic,strong)UITableView *tableView;

@property (nonatomic,strong)UITableView *groupTableView;

@property (nonatomic,strong)TPKeyboardAvoidingTableView *tpTableView;

@property (nonatomic,strong)TPKeyboardAvoidingTableView *tpGroupTableView;

@property (nonatomic,assign)BOOL isHiddenBackBtn;

- (void)performBlock:(void(^)())block afterDelay:(NSTimeInterval)delay;//延迟调用

- (void)presentSheet:(NSString *)title;

- (void)presentSheetOnKeyWindow:(UIWindow *)window andTitle:(NSString *)title;

- (void)displayOverFlowActivityView;

- (void)removeOverFlowActivityView;

- (void)initBackBtn;

- (void)pushViewController:(UIViewController *)viewController animated:(BOOL)animated;

@end
