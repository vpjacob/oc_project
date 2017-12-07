//
//  JJShareToContactViewController.m
//  WisdomLife
//
//  Created by 刘毅 on 2017/12/7.
//  Copyright © 2017年 wisdomlife. All rights reserved.
//

#import "JJShareToContactViewController.h"
#import <ContactsUI/ContactsUI.h>
#import <MessageUI/MessageUI.h> 
#import "MBProgressHUD.h"
#import "AppDelegate.h"

@interface JJShareToContactViewController ()<CNContactPickerDelegate,MFMessageComposeViewControllerDelegate>

@property (nonatomic , strong) CNContactPickerViewController *contactPicker;
@property (nonatomic, strong) MFMessageComposeViewController *msgVC;

@end

@implementation JJShareToContactViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    self.commonNavBar.title = @"分享给联系人";
    
    //创建CNContactStore对象,用与获取和保存通讯录信息
    CNContactStore *contactStore = [[CNContactStore alloc] init];
    
    if ([CNContactStore authorizationStatusForEntityType:CNEntityTypeContacts] == CNAuthorizationStatusNotDetermined) {
        //首次访问通讯录会调用
        [contactStore requestAccessForEntityType:CNEntityTypeContacts completionHandler:^(BOOL granted, NSError * _Nullable error) {
            if (error) return;
            if (granted) {//允许
                
                [self fetchContactWithContactStore:contactStore];//访问通讯录
            }else{//拒绝
                AppDelegate* delege = (AppDelegate *)[UIApplication sharedApplication].delegate;
                
                MBProgressHUD *hud = [MBProgressHUD showHUDAddedTo:delege.window animated:YES];
                hud.mode = MBProgressHUDModeText;
                hud.margin = 15.f;
                hud.yOffset = 00.f;
                hud.removeFromSuperViewOnHide = YES;
                [hud hide:YES afterDelay:4];
                hud.labelText = @"拒绝访问通讯录";
            }
        }];
    }
    else if([CNContactStore authorizationStatusForEntityType:CNEntityTypeContacts] == CNAuthorizationStatusAuthorized){

        NSError *error = nil;

        //创建数组,必须遵守CNKeyDescriptor协议,放入相应的字符串常量来获取对应的联系人信息
        NSArray <id<CNKeyDescriptor>> *keysToFetch = @[CNContactFamilyNameKey, CNContactGivenNameKey, CNContactPhoneNumbersKey];
        //创建获取联系人的请求
        CNContactFetchRequest *fetchRequest = [[CNContactFetchRequest alloc] initWithKeysToFetch:keysToFetch];
        //遍历查询
        [contactStore enumerateContactsWithFetchRequest:fetchRequest error:&error usingBlock:^(CNContact * _Nonnull contact, BOOL * _Nonnull stop) {
            if (!error) {

            }
            else{
                NSLog(@"error:%@", error.localizedDescription);
            }
        }];

        //调用通讯录
        [self presentViewController:self.contactPicker  animated:YES completion:nil];
    }

    else{
        AppDelegate* delege = (AppDelegate *)[UIApplication sharedApplication].delegate;
        
        MBProgressHUD *hud = [MBProgressHUD showHUDAddedTo:delege.window animated:YES];
        hud.mode = MBProgressHUDModeText;
        hud.margin = 15.f;
        hud.yOffset = 00.f;
        hud.removeFromSuperViewOnHide = YES;
        [hud hide:YES afterDelay:2];
        //无权限访问
        hud.labelText = @"请去设置中打开通讯录使用权限";
        [self.navigationController popViewControllerAnimated:YES];
    }
}

#pragma  mark 访问通讯录
- (void)fetchContactWithContactStore:(CNContactStore *)contactStore{
    
    //调用通讯录
    self.contactPicker.displayedPropertyKeys =@[CNContactEmailAddressesKey, CNContactBirthdayKey, CNContactImageDataKey];
    [self presentViewController:self.contactPicker  animated:YES completion:nil];
    
}

#pragma mark 选择联系人进入详情

- (void)contactPickerDidCancel:(CNContactPickerViewController *)picker{
    AppDelegate* delege = (AppDelegate *)[UIApplication sharedApplication].delegate;
    
    MBProgressHUD *hud = [MBProgressHUD showHUDAddedTo:delege.window animated:YES];
    hud.mode = MBProgressHUDModeText;
    hud.margin = 15.f;
    hud.yOffset = 00.f;
    hud.removeFromSuperViewOnHide = YES;
    [hud hide:YES afterDelay:4];
    hud.labelText = @"您点击了取消分享给联系人~~";
    [self.navigationController popViewControllerAnimated:YES];
}

- (void)contactPicker:(CNContactPickerViewController *)picker didSelectContact:(CNContact *)contact{
//    DLog(@"-----%@",contact.phoneNumbers.firstObject);
    if( [MFMessageComposeViewController canSendText] )
    {
    dispatch_async(dispatch_get_main_queue(), ^{
        
    NSString *phoneNumber = contact.phoneNumbers.firstObject.value.stringValue;
        if (phoneNumber == nil) {
            AppDelegate* delege = (AppDelegate *)[UIApplication sharedApplication].delegate;
            
            MBProgressHUD *hud = [MBProgressHUD showHUDAddedTo:delege.window animated:YES];
            hud.mode = MBProgressHUDModeText;
            hud.margin = 15.f;
            hud.yOffset = 00.f;
            hud.removeFromSuperViewOnHide = YES;
            [hud hide:YES afterDelay:4];

            hud.labelText = @"请选择带有手机号的联系人";
            [self.navigationController popViewControllerAnimated:YES];
            return ;
        }else{
            self.msgVC = [[MFMessageComposeViewController alloc] init];
            self.msgVC.body = @"点击链接就可以下载~小客,好用的物业软件。  https://itunes.apple.com/cn/app/id1182914885?mt=8";
            self.msgVC.recipients = @[phoneNumber];
            self.msgVC.messageComposeDelegate = self;
            [self presentViewController:self.msgVC animated:YES completion:nil];
        }
    });
    }else{
        AppDelegate* delege = (AppDelegate *)[UIApplication sharedApplication].delegate;
        
        MBProgressHUD *hud = [MBProgressHUD showHUDAddedTo:delege.window animated:YES];
        hud.mode = MBProgressHUDModeText;
        hud.margin = 15.f;
        hud.yOffset = 00.f;
        hud.removeFromSuperViewOnHide = YES;
        [hud hide:YES afterDelay:4];

        hud.labelText = @"当前设备不能发送短信";
    }
    

}

-(void)messageComposeViewController:(MFMessageComposeViewController *)controller didFinishWithResult:(MessageComposeResult)result {
    [self dismissViewControllerAnimated:YES completion:nil];
    [self.navigationController popViewControllerAnimated:YES];
    AppDelegate* delege = (AppDelegate *)[UIApplication sharedApplication].delegate;
    
    MBProgressHUD *hud = [MBProgressHUD showHUDAddedTo:delege.window animated:YES];
    hud.mode = MBProgressHUDModeText;
    hud.margin = 15.f;
    hud.yOffset = 00.f;
    hud.removeFromSuperViewOnHide = YES;
    [hud hide:YES afterDelay:4];
    
    switch (result) {
        case MessageComposeResultSent:
            hud.labelText = @"成功 ~0~";
            break;
        case MessageComposeResultFailed:
            hud.labelText = @"发送失败 %>_<%";
            
            break;
        case MessageComposeResultCancelled:
            hud.labelText = @"取消发送 %>_<%";
            break;
        default:
            break;
    }
}

- (CNContactPickerViewController *)contactPicker{
    if (!_contactPicker) {
        _contactPicker = [[CNContactPickerViewController alloc] init];
        _contactPicker.delegate = self;
    }
    return _contactPicker;
}

@end
