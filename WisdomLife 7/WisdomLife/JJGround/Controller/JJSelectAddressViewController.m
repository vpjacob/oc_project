//
//  JJSelectAddressViewController.m
//  WisdomLife
//
//  Created by 刘毅 on 2017/8/18.
//  Copyright © 2017年 wisdomlife. All rights reserved.
//

#import "JJSelectAddressViewController.h"
#import "JFCityCollectionFlowLayout.h"
#import "JJAbroadCityCollectionCell.h"
#import "JJSectionCollectionReusableView.h"
#import "JJHotAbroadCollectionCell.h"


static NSString *rightCell = @"rightCell";
static NSString *leftCell = @"rightCell";
@interface JJSelectAddressViewController ()<UITableViewDelegate,UITableViewDataSource,UICollectionViewDelegate,UICollectionViewDataSource,UICollectionViewDelegateFlowLayout>



@property (nonatomic, strong) UITableView *leftTableView;
@property (nonatomic, strong) UICollectionView *rightCollectionView;

@property (nonatomic, strong) NSMutableArray *dateSource;
@property (nonatomic, strong) NSMutableArray *leftDateSource;
@property (nonatomic, strong) NSMutableArray *rightDateSource;
@property (nonatomic, strong) NSArray *dataArray;
@property (nonatomic, strong) NSArray *cityIconArray;
@property (nonatomic, strong) NSMutableArray *sectionTitleArray;
@property (nonatomic, assign) NSInteger selectedIndex;

@end

@implementation JJSelectAddressViewController

- (void)dealloc{
    NSLog(@"JJSelectAddressViewController  dealloc");
}

- (void)viewDidLoad {
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor whiteColor];
    [self initSubviews];
    
}

#pragma mark - init
- (void)initSubviews{
    self.dateSource = [NSMutableArray array];
    self.leftDateSource = [NSMutableArray array];
    self.rightDateSource = [NSMutableArray array];
    self.sectionTitleArray = [NSMutableArray array];
    self.selectedIndex = 0;
    [self.view addSubview:self.leftTableView];
    [self.view addSubview:self.rightCollectionView];
    
    self.dataArray = @[
                       
                       @{@"title":@"推荐",@"list":@[@{@"海外热门目的地":@[@"香港\nHong Kong",@"澳门\nMacau",@"东京\nTokyo",@"曼谷\nBangkok",@"台北\nTaipei",@"新加坡\nSinapore"]}]},
                       
                       @{@"title":@"港澳台",@"list":@[@{@"港澳台热门目的地":@[@"香港\nHong Kong",@"澳门\nMacau",@"台北\nTaipei",@"高雄\nKaohsiung"]},@{@"香港":@[@"香港"]},@{@"澳门":@[@"澳门"]},@{@"台湾":@[@"台湾",@"台北",@"屏东",@"南投",@"高雄",@"新北",@"花莲",@"台中",@"桃园",@"宜兰",@"新竹市",@"彰化"]}]},
                       
                       @{@"title":@"新马泰",@"list":@[
                                 @{@"新马泰热门目的地":@[@"曼谷\nBangkok",@"普吉岛\nPhuket Island",@"新加坡\nSingapore",@"吉隆坡\nKuala Lumpur"]},
                                 @{@"泰国":@[@"泰国",@"曼谷",@"普吉岛",@"芭提雅",@"清迈",@"苏梅岛",@"甲米",@"清莱",@"华欣"]},
                                 @{@"马来尼西亚":@[@"马来尼西亚",@"吉隆坡",@"亚庇",@"沙巴",@"槟城",@"新山",@"兰卡威"]},
                                 @{@"新加坡":@[@"新加坡"]}
                                 ]},
                       
                       @{@"title":@"日韩",@"list":@[
                                 @{@"日韩热门目的地":@[@"东京\nTokyo",@"首尔\nSeoul",@"大阪\nOsaka",@"京都\nKyoto"]},
                                 @{@"日本":@[@"日本",@"京东",@"大阪",@"京都",@"千叶",@"爱知",@"名古屋",@"横滨",@"福冈",@"奈良",@"静冈",@"那霸市"]},
                                 @{@"韩国":@[@"韩国",@"首尔",@"京畿道",@"济州岛",@"釜山",@"仁川"]}
                                 ]},
                       
                       @{@"title":@"亚洲其他",@"list":@[
                                 @{@"亚洲其他热门目的地":@[@"巴厘岛\nBali",@"芽庄\nNha Trang",@"暹粒\nSiem Reap",@"长滩岛\nBoracay"]},
                                 @{@"菲律宾":@[@"菲律宾",@"马尼拉",@"宿雾",@"长滩岛"]},
                                 @{@"越南":@[@"越南",@"芽庄",@"胡志明市",@"河内",@"岘港",@"会安"]},
                                 @{@"柬埔寨":@[@"柬埔寨",@"暹粒",@"金边"]},
                                 @{@"斯里兰卡":@[@"斯里兰卡"]},
                                 @{@"印度":@[@"印度"]},
                                 @{@"印度尼西亚":@[@"印度尼西亚",@"巴厘岛",@"雅加达",@"泗水",@"万隆",@"日惹"]},
                                 @{@"马尔代夫":@[@"马尔代夫"]},
                                 @{@"尼泊尔":@[@"尼泊尔",@"加德满都"]},
                                 ]},
                       
                       @{@"title":@"美洲",@"list":@[
                                 @{@"美洲热门目的地":@[@"洛杉矶\nLos Angeles",@"纽约市\nNew York",@"旧金山\nSan Francisco",@"多伦多\nToronto"]},
                                 @{@"美国":@[@"美国",@"洛杉矶",@"纽约市",@"加利福尼亚州",@"旧金山",@"拉斯维加斯",@"金泽西州",@"圣迭戈",@"马萨诸塞州",@"纽约州",@"弗吉尼亚州",@"华盛顿州",]},
                                 @{@"加拿大":@[@"加拿大",@"多伦多",@"不列颠哥伦比亚省",@"安大略省",@"温哥华",@"蒙特娄",@"渥太华",@"魁北克",@"尼亚加拉瀑布"]},
                                 @{@"墨西哥":@[@"墨西哥",@"墨西哥城"]},
                                 @{@"巴西":@[@"巴西"]},
                                 @{@"阿根廷":@[@"阿根廷"]},
                                 ]},
                       
                       @{@"title":@"大洋洲",@"list":@[
                                 @{@"大洋洲热门目的地":@[@"悉尼\nSydney",@"墨尔本\nMelbourne",@"奥克兰\nAuckland",@"皇后镇\nQueenstown"]},
                                 @{@"澳大利亚":@[@"澳大利亚",@"墨尔本",@"悉尼",@"布里斯班",@"黄金海岸",@"阿德莱德",@"堪培拉",@"塔斯马尼亚岛",@"柏斯",@"北领地",@"吉朗"]},
                                 @{@"新西兰":@[@"新西兰",@"奥克兰",@"新西兰南岛",@"皇后镇",@"惠灵顿"]},
                                 @{@"斐济":@[@"斐济"]},
                                 ]},
                       
                       @{@"title":@"欧洲",@"list":@[
                                 @{@"欧洲热门目的地":@[@"伦敦\nLondon",@"巴黎\nParis",@"罗马\nRome",@"巴塞罗那\nBarcelna"]},
                                 @{@"法国":@[@"法国",@"巴黎",@"勃垦地",@"尼斯",@"阿尔萨斯",@"里昂",@"蔚蓝海岸",@"波尔多",@"诺曼底",@"图卢兹",@"阿维尼翁"]},
                                 @{@"意大利":@[@"意大利",@"罗马",@"米兰",@"托斯卡纳",@"富罗伦萨",@"伦巴第大区",@"威尼斯",@"那不勒斯",@"都灵",@"翁布利亚大区",@"锡耶纳"]},
                                 @{@"德国":@[@"德国",@"法兰克福",@"慕尼黑",@"柏林",@"北莱茵-威斯特法伦",@"斯图加特",@"杜塞尔多夫",@"汉堡",@"莱茵兰-普法尔茨",@"卡尔斯鲁厄",@"科隆"]},
                                 @{@"西班牙":@[@"西班牙",@"马德里",@"巴塞罗那",@"塞维利亚",@"卡斯蒂利亚-莱昂",@"巴利阿里群岛",@"卡斯蒂亚-阿曼恰",@"阿拉贡自治区",@"格拉纳达",@"巴斯克自治区",@"科尔多瓦"]},
                                 @{@"英国":@[@"英国",@"伦敦",@"爱丁堡",@"曼彻斯特",@"剑桥",@"诺丁汉",@"南安普顿",@"格拉斯哥",@"布里斯托",@"巴斯",@"伯恩茅斯"]},
                                 @{@"瑞士":@[@"瑞士",@"苏黎世",@"洛桑",@"瓦莱州",@"巴塞尔"]},
                                 @{@"荷兰":@[@"荷兰",@"阿姆特斯丹",@"海牙",@"乌得勒支"]},
                                 @{@"奥地利":@[@"奥地利",@"维也纳",@"格拉茨"]},
                                 @{@"捷克":@[@"捷克",@"布拉格"]},
                                 @{@"希腊":@[@"希腊",@"雅典",@"圣托里尼",@"克里特"]},
                                 @{@"俄罗斯":@[@"俄罗斯",@"莫斯科",@"圣彼得堡",@"海参崴",@"叶卡捷琳堡"]},
                                 @{@"丹麦":@[@"丹麦",@"哥本哈根"]},
                                 @{@"匈牙利":@[@"匈牙利",@"布达佩斯"]},
                                 @{@"瑞典":@[@"瑞典",@"斯德哥尔摩",@"斯科纳"]},
                                 @{@"葡萄牙":@[@"葡萄牙",@"里斯本",@"马德拉群岛",@"波尔图"]},
                                 @{@"挪威":@[@"挪威",@"奥斯陆"]},
                                 @{@"比利时":@[@"比利时"]},
                                 @{@"芬兰":@[@"芬兰"]},
                                 @{@"波兰":@[@"波兰"]},
                                 @{@"斯洛伐克":@[@"斯洛伐克"]},
                                 @{@"爱尔兰":@[@"爱尔兰"]},
                                 ]},
                       
                       @{@"title":@"中东非洲",@"list":@[
                                 @{@"中东非洲热门目的地":@[@"迪拜\nDubai",@"阿布扎比\nAbu Dhabi",@"伊斯坦布尔\nIstanbul",@"南非\nSouth Africa"]},
                                 @{@"阿联酋":@[@"阿联酋",@"迪拜",@"阿布扎比"]},
                                 @{@"土耳其":@[@"土耳其",@"伊斯坦布尔",@"安卡拉",@"伊兹密尔",@"安塔利亚",@"费特希耶"]},
                                 @{@"沙特阿拉伯":@[@"沙特阿拉伯"]},
                                 @{@"毛里求斯":@[@"毛里求斯"]},
                                 @{@"南非":@[@"南非"]},
                                 @{@"以色列":@[@"以色列"]},
                                 ]},
                       
                       ];
    
    self.cityIconArray = @[
                           @[@"hongkong",@"macau",@"dongjing",@"bangkok",@"taipei",@"singapore"],
                           @[@"hongkong",@"macau",@"taipei",@"Kaohsiung",],
                           @[@"bangkok",@"phuket",@"singapore",@"kualalumpur",],
                           @[@"dongjing",@"shouer",@"daban",@"jingdu",],
                           @[@"bali",@"Nhatrang",@"SiemReap",@"boracay",],
                           @[@"losangeles",@"newyork",@"sanfrancisco",@"Toronto",],
                           @[@"Sydney",@"melbourne",@"auckland",@"queenstown",],
                           @[@"london",@"paris",@"rome",@"barcelona",],
                           @[@"dubai",@"abudhabi",@"Istanbul",@"SouthAfrica",],
                           ];
    
    for (int i = 0; i < self.dataArray.count; i++) {
        [self.leftDateSource addObject:self.dataArray[i][@"title"]];
        [self.rightDateSource addObject:self.dataArray[i][@"list"]];
    }
    
    NSArray *arr = self.rightDateSource[0];
    [self.dateSource addObjectsFromArray:arr];
    
    for (int i = 0; i<self.dateSource.count; i++) {
        NSDictionary *dic = self.dateSource[i];
        NSString * str = dic.allKeys.firstObject;
        [self.sectionTitleArray addObject:str];
    }
    
}

#pragma mark -  UITableViewDataSource

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView{
    return 1;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section{
    
    return _leftDateSource.count;
}

-(UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath{
    UITableViewCell * cell;
    cell = [tableView dequeueReusableCellWithIdentifier:leftCell forIndexPath:indexPath];
    cell.textLabel.text = [_dataArray[indexPath.row]objectForKey:@"title"];
    cell.textLabel.font = [UIFont systemFontOfSize:14];
    
    return cell;
    
}

#pragma mark - UITableViewDelegate

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath{
    if (tableView == self.leftTableView) {
        [self.dateSource removeAllObjects];
        NSArray *arr = _rightDateSource[indexPath.row];
        [self.dateSource addObjectsFromArray:arr];
        
        [self.sectionTitleArray removeAllObjects];
        for (int i = 0; i<self.dateSource.count; i++) {
            NSDictionary *dic = self.dateSource[i];
            NSString * str = dic.allKeys.firstObject;
            [self.sectionTitleArray addObject:str];
        }
        self.selectedIndex = indexPath.row;
        
        
        [self.rightCollectionView scrollToItemAtIndexPath:[NSIndexPath indexPathForItem:0 inSection:0] atScrollPosition:UICollectionViewScrollPositionTop animated:NO];
        [self.rightCollectionView reloadData];
    }
    
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath{
    return 50;
}

#pragma mark - UICollectionViewDataSource

-(NSInteger)numberOfSectionsInCollectionView:(UICollectionView *)collectionView{
    return self.dateSource.count;
}

- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section{
    NSDictionary *dic = self.dateSource[section];
    NSArray *arr = dic.allValues.firstObject;
    NSInteger row = arr.count;
    return row;
}

- (__kindof UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath{
    if (indexPath.section == 0) {
        JJHotAbroadCollectionCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:@"JJHotAbroadCollectionCell" forIndexPath:indexPath];
        cell.backgroundColor = [UIColor redColor];
        NSDictionary *dic = self.dateSource[indexPath.section];
        NSArray *arr = dic.allValues.firstObject;
        NSString *rowStr = arr[indexPath.row];
        cell.titleLabel.text = rowStr;
        
        cell.backGroundImageView.image = [UIImage imageNamed:self.cityIconArray[self.selectedIndex][indexPath.item]];
        return cell;
    }
    JJAbroadCityCollectionCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:@"JJAbroadCityCollectionCell" forIndexPath:indexPath];
    
    NSDictionary *dic = self.dateSource[indexPath.section];
    NSArray *arr = dic.allValues.firstObject;
    NSString *rowStr = arr[indexPath.row];
    cell.titleLabel.text = rowStr;
    cell.backgroundColor = [UIColor colorWithHexString:@"f4f4f4"];
    return cell;
}

- (UICollectionReusableView *)collectionView:(UICollectionView *)collectionView viewForSupplementaryElementOfKind:(NSString *)kind atIndexPath:(NSIndexPath *)indexPath{
    JJSectionCollectionReusableView *reusabel;
    if (kind == UICollectionElementKindSectionHeader) {
        reusabel = [collectionView dequeueReusableSupplementaryViewOfKind:UICollectionElementKindSectionHeader withReuseIdentifier:@"JJSectionCollectionReusableView" forIndexPath:indexPath];
    }
    reusabel.titleLabel.text = self.sectionTitleArray[indexPath.section];
    return reusabel;
}

#pragma mark - UICollectionViewDelegate

- (CGSize)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout*)collectionViewLayout sizeForItemAtIndexPath:(NSIndexPath *)indexPath{
    CGFloat margin = 20;
    if (indexPath.section == 0) {
        return CGSizeMake((self.rightCollectionView.frame.size.width  - margin*2)/ 2, 70);
    }
    
    CGFloat itemW = (self.rightCollectionView.frame.size.width  - margin * 2)/ 3;
    CGSize itemSize = CGSizeMake(itemW, 40);
    return itemSize;
}
//- (UIEdgeInsets)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout*)collectionViewLayout insetForSectionAtIndex:(NSInteger)section{
//    return UIEdgeInsetsMake(0, 10, 0, 10);
//}
- (CGFloat)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout*)collectionViewLayout minimumLineSpacingForSectionAtIndex:(NSInteger)section{
    return 10;
}
- (CGFloat)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout*)collectionViewLayout minimumInteritemSpacingForSectionAtIndex:(NSInteger)section{
    return 10;
}

- (CGSize)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout*)collectionViewLayout referenceSizeForHeaderInSection:(NSInteger)section{
    return CGSizeMake(self.rightCollectionView.width, 40);
}
//- (CGSize)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout*)collectionViewLayout referenceSizeForFooterInSection:(NSInteger)section;


- (void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath{
    NSDictionary *dic = self.dateSource[indexPath.section];
    NSArray *arr = dic.allValues.firstObject;
    NSString *rowStr = arr[indexPath.row];
    rowStr = [rowStr componentsSeparatedByString:@"\n"].firstObject;
    
    self.cityNameBlock(rowStr);

}


#pragma mark - Setter&Getter
- (UITableView *)leftTableView{
    if (!_leftTableView) {
        CGFloat scrollerViewHeight = kDeviceHeight - 64 - 50;
        _leftTableView = [[UITableView alloc] initWithFrame:CGRectMake(0, 0, kDeviceWidth*0.25, scrollerViewHeight) style:UITableViewStylePlain];
        _leftTableView.dataSource = self;
        _leftTableView.delegate = self;
        _leftTableView.separatorStyle = UITableViewCellSeparatorStyleNone;
        [_leftTableView registerClass:[UITableViewCell class] forCellReuseIdentifier:leftCell];
    }
    return _leftTableView;
}


- (UICollectionView *)rightCollectionView{
    if (!_rightCollectionView) {
        CGFloat scrollerViewHeight = kDeviceHeight - 64 - 50;
        UICollectionViewFlowLayout *flowLayout = [[UICollectionViewFlowLayout alloc] init];
        _rightCollectionView = [[UICollectionView alloc] initWithFrame:CGRectMake(kDeviceWidth*0.25, 0, kDeviceWidth*0.75, scrollerViewHeight) collectionViewLayout:flowLayout];
        _rightCollectionView.backgroundColor = [UIColor whiteColor];
        _rightCollectionView.delegate = self;
        _rightCollectionView.dataSource = self;
        _rightCollectionView.contentInset = UIEdgeInsetsMake(0, 10, 10, 10);
        [_rightCollectionView registerNib:[UINib nibWithNibName:@"JJAbroadCityCollectionCell" bundle:nil] forCellWithReuseIdentifier:@"JJAbroadCityCollectionCell"];
        [_rightCollectionView registerNib:[UINib nibWithNibName:@"JJSectionCollectionReusableView" bundle:nil] forSupplementaryViewOfKind:UICollectionElementKindSectionHeader withReuseIdentifier:@"JJSectionCollectionReusableView"];
        [_rightCollectionView registerNib:[UINib nibWithNibName:@"JJHotAbroadCollectionCell" bundle:nil] forCellWithReuseIdentifier:@"JJHotAbroadCollectionCell"];
    }
    return _rightCollectionView;
}

@end
