//
//  QRCodeDetailViewController.m
//  SmartDoor
//
//  Created by 宏根 张 on 22/05/2017.
//  Copyright © 2017 朱攀峰. All rights reserved.
//

#import "QRCodeDetailViewController.h"
#import "QRCodeDetailView.h"
//#import <ShareSDK/ShareSDK.h>
//#import <ShareSDKUI/ShareSDK+SSUI.h>

@interface QRCodeDetailViewController ()

@property (nonatomic, strong) QRCodeDetailView *qrCodeView;
@property (nonatomic, strong) UIImage *qrCodeImage;

@end

@implementation QRCodeDetailViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    self.commonNavBar.title = NSLocalizedString(@"send_temp_pwd_share_qrcode", @"");
    // Do any additional setup after loading the view.
}

-(void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    [self.view addSubview:self.qrCodeView];
    [self.view bringSubviewToFront:self.commonNavBar];
}

-(QRCodeDetailView *)qrCodeView
{
    if (!_qrCodeView) {
        _qrCodeView = [[QRCodeDetailView alloc] initWithFrame:CGRectMake(0, 0, kDeviceWidth, kDeviceHeight)];
        
        NSData *qrData = [[NSData alloc] initWithBase64EncodedString:self.qrStr options:NSDataBase64DecodingIgnoreUnknownCharacters];
        UIImage *qrImage = [[UIImage alloc] initWithData:qrData];
        
        _qrCodeView.qrcodeImageView.image = qrImage;
        
        self.qrCodeImage = qrImage;
        
//        [_qrCodeView.QQImageView addTarget:self action:@selector(shareToQQ:) forControlEvents:UIControlEventTouchUpInside];
//        [_qrCodeView.WechatImageView addTarget:self action:@selector(shareToWechat:) forControlEvents:UIControlEventTouchUpInside];
    }
    return _qrCodeView;
}

//-(void)shareToQQ:(UIButton *)sender
//{
//    [self shareWithImage:self.qrCodeImage andType:1];
//}
//
//-(void)shareToWechat:(UIButton *)sender
//{
//    [self shareWithImage:self.qrCodeImage andType:2];
//}

//-(void)shareWithImage:(UIImage *)image andType:(int)type
//{
//    //测试分享功能--Benson
//    
//    //1、创建分享参数
//    NSArray* imageArray = @[image];
//    //（注意：图片必须要在Xcode左边目录里面，名称必须要传正确，如果要分享网络图片，可以这样传iamge参数 images:@[@"http://mob.com/Assets/images/logo.png?v=20150320"]）
//    if (imageArray) {
//        
//        NSMutableDictionary *shareParams = [NSMutableDictionary dictionary];
//        [shareParams SSDKSetupShareParamsByText:nil
//                                         images:imageArray
//                                            url:nil
//                                          title:nil
//                                           type:SSDKContentTypeAuto];
//        //有的平台要客户端分享需要加此方法，例如微博
//        [shareParams SSDKEnableUseClientShare];
//        //2、分享（可以弹出我们的分享菜单和编辑界面）
//        SSDKPlatformType Platfromtype;
//        
//        if (type == 1) {
//            Platfromtype = SSDKPlatformSubTypeQQFriend;
//        }else
//        {
//            Platfromtype = SSDKPlatformSubTypeWechatSession;
//        }
//        
//        [ShareSDK share:Platfromtype parameters:shareParams onStateChanged:^(SSDKResponseState state, NSDictionary *userData, SSDKContentEntity *contentEntity, NSError *error) {
//            switch (state) {
//                case SSDKResponseStateSuccess:
//                {
//                    UIAlertView *alertView = [[UIAlertView alloc] initWithTitle:@"分享成功"
//                                                                        message:nil
//                                                                       delegate:nil
//                                                              cancelButtonTitle:@"确定"
//                                                              otherButtonTitles:nil];
//                    [alertView show];
//                    break;
//                }
//                case SSDKResponseStateFail:
//                {
//                    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"分享失败"
//                                                                    message:[NSString stringWithFormat:@"%@",error]
//                                                                   delegate:nil
//                                                          cancelButtonTitle:@"OK"
//                                                          otherButtonTitles:nil, nil];
//                    [alert show];
//                    break;
//                }
//                default:
//                    break;
//            }
//        }];
//    }
//}

@end
