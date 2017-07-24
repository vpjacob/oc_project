//
//  JJScanViewController.m
//  WisdomLife
//
//  Created by 刘毅 on 2017/7/11.
//  Copyright © 2017年 wisdomlife. All rights reserved.
//

#import "JJScanViewController.h"
#import <AVFoundation/AVFoundation.h>
#import "APIWidgetContainer.h"
#import <AudioToolbox/AudioToolbox.h>

@interface JJScanViewController ()<AVCaptureMetadataOutputObjectsDelegate,UIImagePickerControllerDelegate,UINavigationControllerDelegate>{
    int num;
    BOOL upOrdown;
    NSTimer * timer;
    CAShapeLayer *cropLayer;
}
@property (strong,nonatomic)AVCaptureDevice * device;
@property (strong,nonatomic)AVCaptureDeviceInput * input;
@property (strong,nonatomic)AVCaptureMetadataOutput * output;
@property (strong,nonatomic)AVCaptureSession * session;
@property (strong,nonatomic)AVCaptureVideoPreviewLayer * preview;
@property (nonatomic, strong) UIImageView * line;
@property (strong, nonatomic) CIDetector *detector;
@property (nonatomic, strong) APIWidgetContainer *windowContainer;
@end

@implementation JJScanViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
    self.view.backgroundColor = [UIColor whiteColor];
    [self configView];
}

-(void)configView{
    UIImageView * imageView = [[UIImageView alloc]initWithFrame:kScanRect];
    imageView.image = [UIImage imageNamed:@"pick_bg"];
    [self.view addSubview:imageView];
    
    UIView* backView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, SCREEN_WIDTH, 64)];
    backView.backgroundColor = [UIColor whiteColor];
    [self.view addSubview:backView];
    
    UIButton *backBtn = [[UIButton alloc] init];
    [backBtn setTitle:@"返回" forState:UIControlStateNormal];
    [backBtn setTitleColor:[UIColor blackColor] forState:UIControlStateNormal];
    backBtn.frame = CGRectMake(0, 20, SCREEN_WIDTH/3, 44);
    [backView addSubview:backBtn];
    [backBtn addTarget:self action:@selector(btnAction) forControlEvents:UIControlEventTouchUpInside];
    
    UIButton *imageQRCodeBtn = [[UIButton alloc] init];
    [imageQRCodeBtn setTitle:@"选择" forState:UIControlStateNormal];
    [imageQRCodeBtn setTitleColor:[UIColor blackColor] forState:UIControlStateNormal];
    imageQRCodeBtn.frame = CGRectMake(SCREEN_WIDTH/3, 20, SCREEN_WIDTH/3, 44);
    [backView addSubview:imageQRCodeBtn];
    [imageQRCodeBtn addTarget:self action:@selector(clickImageQRCodeButton) forControlEvents:UIControlEventTouchUpInside];
    
    UIButton *openFlashBtn = [[UIButton alloc] init];
    [openFlashBtn setTitle:@"打开手电筒" forState:UIControlStateNormal];
    [openFlashBtn setTitleColor:[UIColor blackColor] forState:UIControlStateNormal];
    openFlashBtn.frame = CGRectMake(SCREEN_WIDTH*2/3, 20, SCREEN_WIDTH/3, 44);
    [backView addSubview:openFlashBtn];
    [openFlashBtn addTarget:self action:@selector(openFlash:) forControlEvents:UIControlEventTouchUpInside];
    
    upOrdown = NO;
    num =0;
    _line = [[UIImageView alloc] initWithFrame:CGRectMake(LEFT, TOP+10, 220, 2)];
    _line.image = [UIImage imageNamed:@"line.png"];
    [self.view addSubview:_line];
    
    timer = [NSTimer scheduledTimerWithTimeInterval:.02 target:self selector:@selector(animation1) userInfo:nil repeats:YES];
    
}

-(void)viewWillAppear:(BOOL)animated{
    
    [self setCropRect:kScanRect];
    
    [self performSelector:@selector(setupCamera) withObject:nil afterDelay:0.3];
    
}

- (void)btnAction{
    [_session stopRunning];
    [timer setFireDate:[NSDate distantFuture]];
    [self.navigationController popViewControllerAnimated:YES];
}

- (void)openFlash:(UIButton *)sender {
    sender.selected = !sender.selected;
    if (sender.isSelected == YES) { //打开闪光灯
        AVCaptureDevice *captureDevice = [AVCaptureDevice defaultDeviceWithMediaType:AVMediaTypeVideo];
        NSError *error = nil;
        
        if ([captureDevice hasTorch]) {
            BOOL locked = [captureDevice lockForConfiguration:&error];
            if (locked) {
                captureDevice.torchMode = AVCaptureTorchModeOn;
                [captureDevice unlockForConfiguration];
            }
        }
    }else{//关闭闪光灯
        AVCaptureDevice *device = [AVCaptureDevice defaultDeviceWithMediaType:AVMediaTypeVideo];
        if ([device hasTorch]) {
            [device lockForConfiguration:nil];
            [device setTorchMode: AVCaptureTorchModeOff];
            [device unlockForConfiguration];
        }
    }
}

#pragma mark - Checking RightBarButtonItem
-(void)clickImageQRCodeButton
{
    [_session stopRunning];
    [timer setFireDate:[NSDate distantFuture]];
    self.detector = [CIDetector detectorOfType:CIDetectorTypeQRCode context:nil options:@{ CIDetectorAccuracy : CIDetectorAccuracyHigh }];
    UIImagePickerController *picker = [[UIImagePickerController alloc] init];
    picker.delegate = self;
    picker.allowsEditing = YES;
    picker.sourceType = UIImagePickerControllerSourceTypePhotoLibrary;
    [self.navigationController presentViewController:picker animated:YES completion:nil];
}

#pragma mark - UIImagePickerControllerDelegate
- ( void )imagePickerController:( UIImagePickerController *)picker didFinishPickingMediaWithInfo:( NSDictionary *)info
{
    [picker dismissViewControllerAnimated:YES completion:nil];
    
    UIImage *image = [info objectForKey:UIImagePickerControllerEditedImage];
    if (!image){
        image = [info objectForKey:UIImagePickerControllerOriginalImage];
    }
    
    NSArray *features = [self.detector featuresInImage:[CIImage imageWithCGImage:image.CGImage]];
    if (features.count >=1) {
        CIQRCodeFeature *feature = [features objectAtIndex:0];
        NSString *scannedResult = feature.messageString;
        
        
        if (self.QRCodeMessage) {
            //            [_beepPlayer play];
            AudioServicesPlaySystemSound(kSystemSoundID_Vibrate);
            // 1007 是短信提示音
            SystemSoundID soundID = 1007;
            AudioServicesPlaySystemSound(soundID);
            self.QRCodeMessage(scannedResult);
        }
        [self.navigationController popViewControllerAnimated:NO];
    }else{

        UIAlertController* alert = [UIAlertController alertControllerWithTitle:@"错误"
                                                                       message:@"不是二维码或者二维码太大"
                                                                preferredStyle:UIAlertControllerStyleAlert];
        
        UIAlertAction* defaultAction = [UIAlertAction actionWithTitle:@"OK" style:UIAlertActionStyleDefault
                                                              handler:^(UIAlertAction * action) {
                                                                  [self.navigationController popViewControllerAnimated:NO];
                                                              }];
        [alert addAction:defaultAction];
        [self presentViewController:alert animated:YES completion:nil];
    }
}

- (void)imagePickerControllerDidCancel:(UIImagePickerController *)picker{
    [picker dismissViewControllerAnimated:YES completion:^{
        [self.navigationController popViewControllerAnimated:YES];
    }];
}

-(void)animation1
{
    if (upOrdown == NO) {
        num ++;
        _line.frame = CGRectMake(LEFT, TOP+10+2*num, 220, 2);
        if (2*num == 200) {
            upOrdown = YES;
        }
    }
    else {
        num --;
        _line.frame = CGRectMake(LEFT, TOP+10+2*num, 220, 2);
        if (num == 0) {
            upOrdown = NO;
        }
    }
}

- (void)setCropRect:(CGRect)cropRect{
    cropLayer = [[CAShapeLayer alloc] init];
    CGMutablePathRef path = CGPathCreateMutable();
    CGPathAddRect(path, nil, cropRect);
    CGPathAddRect(path, nil, self.view.bounds);
    CGPathAddRect(path, nil, CGRectMake(0, 0, SCREEN_WIDTH, 64));
    [cropLayer setFillRule:kCAFillRuleEvenOdd];
    [cropLayer setPath:path];
    [cropLayer setFillColor:[UIColor blackColor].CGColor];
    [cropLayer setOpacity:0.6];
    [cropLayer setNeedsDisplay];
    
    [self.view.layer addSublayer:cropLayer];
}

- (void)setupCamera
{
    AVCaptureDevice *device = [AVCaptureDevice defaultDeviceWithMediaType:AVMediaTypeVideo];
    if (device==nil) {
        UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"提示" message:@"设备没有摄像头" preferredStyle:UIAlertControllerStyleAlert];
        [alert addAction:[UIAlertAction actionWithTitle:@"确认" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
            
        }]];
        [self presentViewController:alert animated:YES completion:nil];
        return;
    }
    // Device
    _device = [AVCaptureDevice defaultDeviceWithMediaType:AVMediaTypeVideo];
    
    // Input
    _input = [AVCaptureDeviceInput deviceInputWithDevice:self.device error:nil];
    
    // Output
    _output = [[AVCaptureMetadataOutput alloc]init];
    [_output setMetadataObjectsDelegate:self queue:dispatch_get_main_queue()];
    
    //设置扫描区域
    CGFloat top = TOP/SCREEN_HEIGHT;
    CGFloat left = LEFT/SCREEN_WIDTH;
    CGFloat width = 220/SCREEN_WIDTH;
    CGFloat height = 220/SCREEN_HEIGHT;
    ///top 与 left 互换  width 与 height 互换
    [_output setRectOfInterest:CGRectMake(top,left, height, width)];
    
    
    // Session
    _session = [[AVCaptureSession alloc]init];
    [_session setSessionPreset:AVCaptureSessionPresetHigh];
    if ([_session canAddInput:self.input])
    {
        [_session addInput:self.input];
    }
    
    if ([_session canAddOutput:self.output])
    {
        [_session addOutput:self.output];
    }
    
    // 条码类型 AVMetadataObjectTypeQRCode
    [_output setMetadataObjectTypes:[NSArray arrayWithObjects:AVMetadataObjectTypeQRCode, nil]];
    
    // Preview
    _preview =[AVCaptureVideoPreviewLayer layerWithSession:_session];
    _preview.videoGravity = AVLayerVideoGravityResizeAspectFill;
    _preview.frame =self.view.layer.bounds;
    [self.view.layer insertSublayer:_preview atIndex:0];
    
    // Start
    [_session startRunning];
}

#pragma mark AVCaptureMetadataOutputObjectsDelegate
- (void)captureOutput:(AVCaptureOutput *)captureOutput didOutputMetadataObjects:(NSArray *)metadataObjects fromConnection:(AVCaptureConnection *)connection
{
    NSString *stringValue;
    
    if ([metadataObjects count] >0)
    {
        //停止扫描
        [_session stopRunning];
        [timer setFireDate:[NSDate distantFuture]];
        
        AVMetadataMachineReadableCodeObject * metadataObject = [metadataObjects objectAtIndex:0];
        stringValue = metadataObject.stringValue;
        if (self.QRCodeMessage) {
             AudioServicesPlaySystemSound(kSystemSoundID_Vibrate);
            // 1007 是短信提示音
            SystemSoundID soundID = 1007;
            AudioServicesPlaySystemSound(soundID);
            self.QRCodeMessage(stringValue);
        }
        
//        if (_session != nil && timer != nil) {
//            [_session startRunning];
//            [timer setFireDate:[NSDate date]];
//        }
        [self.view removeFromSuperview];
        [self removeFromParentViewController];
        [self.navigationController popViewControllerAnimated:NO];
    } else {
        NSLog(@"无扫描信息");
        return;
    }
    
}

@end
