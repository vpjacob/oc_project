//
//  InsureValidate.m
//  Storm
//
//  Created by 朱攀峰 on 15/11/25.
//  Copyright (c) 2015年 MCDS. All rights reserved.
//

#import "InsureValidate.h"

@implementation InsureValidate
+ (NSString *)validateCertificate:(NSString *)certificateNo
{
    NSString *regex2 = @"^(\\d{15}$|^\\d{18}$|^\\d{17}(\\d|X|x))$";
    NSPredicate *identityCardPredicate = [NSPredicate predicateWithFormat:@"SELF MATCHES %@",regex2];
    if (![identityCardPredicate evaluateWithObject:certificateNo]) {
        return @"证件号码有误，请重新输入";
    }
    return nil;
}

+ (NSString *)getBirthdayFromCertificate:(NSString *)certificateNo
{
    NSString *year = [certificateNo substringWithRange:NSMakeRange(6, 4)];
    NSString *month = [certificateNo substringWithRange:NSMakeRange(10, 2)];
    NSString *day = [certificateNo substringWithRange:NSMakeRange(12, 2)];
    NSMutableString *birthday = [[NSMutableString alloc] initWithCapacity:10];
    [birthday appendFormat:@"%@-",year];
    [birthday appendFormat:@"%@-",month];
    [birthday appendFormat:@"%@-",day];
    return birthday;
}

+ (BOOL) validateEmail:(NSString *)email
{
    NSRange range = [email rangeOfString:@".."];
    if (range.location != NSNotFound) {
        return NO;
    }
    //通用版本
    //NSString *emailRegex = @"[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}";
    
    //自定义版本
    NSString *emailRegex = @"[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z0-9.-]+";
    NSPredicate *emailTest = [NSPredicate predicateWithFormat:@"SELF MATCHES %@", emailRegex];
    return [emailTest evaluateWithObject:email];
}

+ (BOOL) validateMobile:(NSString *)mobile
{
    NSString *phoneRegex = @"1[0-9]{10}";//@"^((13[0-9])|(15[^4,\\D])|(18[0,0-9]))\\d{8}$";//手机号以13， 15，18开头，八个 \d 数字字符
    NSPredicate *phoneTest = [NSPredicate predicateWithFormat:@"SELF MATCHES %@",phoneRegex];
    return [phoneTest evaluateWithObject:mobile];
}

//用户名
+ (BOOL) validateUserName:(NSString *)name
{
    NSString *userNameRegex = @"^[A-Za-z0-9]{6,20}+$";
    NSPredicate *userNamePredicate = [NSPredicate predicateWithFormat:@"SELF MATCHES %@",userNameRegex];
    BOOL B = [userNamePredicate evaluateWithObject:name];
    return B;
}

+ (BOOL)validateChinese:(NSString *)name
{
    if (!name || IsStrEmpty(name)) {
        return NO;
    }
   NSString *shouhuorenRegex = @"[\\u4e00-\\u9fa5]{2，10}";
    //备用[\\u4e00-\\u9fa5\\•]{2,32}
    NSPredicate *shouhuorenTest = [NSPredicate predicateWithFormat:@"SELF MATCHES %@",shouhuorenRegex];
    return [shouhuorenTest evaluateWithObject:name];
}
+ (NSDate *)todayAfterSeveralMonths:(NSInteger)months andDays:(NSInteger)days
{
    NSCalendar *calendar = [NSCalendar currentCalendar];
    NSDateComponents *componentsToAdd = [[NSDateComponents alloc] init];
    [componentsToAdd setDay:(days+1)];
    [componentsToAdd setMonth:months];
    NSDate *date = [calendar dateByAddingComponents:componentsToAdd toDate:[NSDate date] options:0];
    return date;
}

+ (NSDate *)todayAfterSeveralDays:(NSInteger)days
{
    NSCalendar *calendar = [NSCalendar currentCalendar];
    NSDateComponents *componentsToAdd = [[NSDateComponents alloc] init];
    [componentsToAdd setDay:(days+1)];
    NSDate *date = [calendar dateByAddingComponents:componentsToAdd toDate:[NSDate date] options:0];
    return date;
}
+ (BOOL)vlidateNumber:(NSString *)number
{
   NSString *reg = @"^\\d+(\\.\\d+)?$";
    NSPredicate *numberTest = [NSPredicate predicateWithFormat:@"SELF MATCHES %@",reg];
    return [numberTest evaluateWithObject:number];
}
+ (NSString *)addWhiteSpaceInStr:(NSString *)text responString:(NSString *)string range:(NSRange)range index:(int)index
{
    NSCharacterSet *characterSet = [NSCharacterSet characterSetWithCharactersInString:@"0123456789\b"];
    string = [string stringByReplacingOccurrencesOfString:@" " withString:@""];
    if ([string rangeOfCharacterFromSet:[characterSet invertedSet]].location != NSNotFound) {
        return nil;
    }
    text = [text stringByReplacingCharactersInRange:range withString:string];
    text = [text stringByReplacingOccurrencesOfString:@" " withString:@""];
    
    NSString *newString = @"";
    while (text.length > 0) {
        NSString *subString = [text substringToIndex:MIN(text.length, index)];
        newString = [newString stringByAppendingString:subString];
        if (subString.length == index) {
            newString = [newString stringByAppendingString:@" "];
        }
        text = [text substringFromIndex:MIN(text.length, index)];
    }
    newString = [newString stringByTrimmingCharactersInSet:[characterSet invertedSet]];
    return newString;
}
+ (NSString *)addWhiteSpaceInStr:(NSString *)text responString:(NSString *)string range:(NSRange)range index:(int)index index1:(int)index1
{
    NSCharacterSet *characterSet = [NSCharacterSet characterSetWithCharactersInString:@"0123456789xX\b"];
    string = [string stringByReplacingOccurrencesOfString:@" " withString:@""];
    if ([string rangeOfCharacterFromSet:[characterSet invertedSet]].location != NSNotFound) {
        return nil;
    }
    text = [text stringByReplacingCharactersInRange:range withString:string];
    text = [text stringByReplacingOccurrencesOfString:@" " withString:@""];
    NSInteger tmpindex = index;
    NSString *newString = @"";
    while (text.length > 0) {
        NSString *subString = [text substringToIndex:MIN(text.length, tmpindex)];
        newString = [newString stringByAppendingString:subString];
        if (subString.length == tmpindex) {
            newString = [newString stringByAppendingString:@" "];
        }
        text = [text substringFromIndex:MIN(text.length, tmpindex)];
        tmpindex = index1;
    }
    newString = [newString stringByTrimmingCharactersInSet:[characterSet invertedSet]];
    return newString;
}
+ (NSString *)deleteWhiteSpaceInStr:(NSString *)string
{
    if (IsNilOrNull(string)) {
        return @"";
    }
    NSCharacterSet *whiteSpace = [NSCharacterSet whitespaceAndNewlineCharacterSet];
    NSPredicate *noEmptyStrings = [NSPredicate predicateWithFormat:@"SELF != ''"];
    NSArray *parts = [string componentsSeparatedByCharactersInSet:whiteSpace];
    NSArray *filteredArray = [parts filteredArrayUsingPredicate:noEmptyStrings];
    string = [filteredArray componentsJoinedByString:@""];
    
    return string;
}
+ (BOOL)validateUnsignInteger:(NSString *)number
{
   NSString *codeRegex = @"[0-9]+";
    NSPredicate *codeTest = [NSPredicate predicateWithFormat:@"SELF MATCHES %@",codeRegex];
    return [codeTest evaluateWithObject:number];
}
+ (BOOL)validateInteger:(NSString *)number
{
    NSString *codeRegex = @"[0-9]{12,12}";
    NSPredicate *codeTest = [NSPredicate predicateWithFormat:@"SELF MATCHES %@",codeRegex];
    return [codeTest evaluateWithObject:number];
}
+ (NSString *)phonenum:(NSString *)phone
{
    NSRange range = {3,6};
    NSString *aString = [phone stringByReplacingCharactersInRange:range withString:@"******"];
    return aString;
}
+ (NSString *)email:(NSString *)email
{
    NSRange range1 = [email rangeOfString:@"@"];
    NSString *subStr = [email substringWithRange:NSMakeRange(0, range1.location)];
    if (subStr.length == 1) {
        NSString *aString = [NSString stringWithFormat:@"%@%@***%@",subStr,subStr,email];
        return aString;
    }
    else if (subStr.length == 2)
    {
        NSRange range = {0,subStr.length-1};
        NSString *string = [email stringByReplacingCharactersInRange:range withString:@"***"];
        NSString *aString = [NSString stringWithFormat:@"%@%@",subStr,string];
        return aString;
    }
    else
    {
        NSRange range = {2,subStr.length-3};
        NSString *aString = [email stringByReplacingCharactersInRange:range withString:@"***"];
        return aString;
    }
}
+ (NSString *)idCard:(NSString *)idCard
{
    NSRange range = {1,idCard.length-2};
    NSString *aString = [idCard stringByReplacingCharactersInRange:range withString:@"*************"];
    return aString;
}
+ (NSString *)name:(NSString *)name
{
    NSInteger nameLength = name.length - 1;
    NSString *str1 = @"";
    for (int i = 0; i < nameLength; i++) {
        NSString *str = @"*";
        str1 = [str1 stringByAppendingString:str];
    }
    NSRange range = {1,name.length-1};
    NSString *aString = [name stringByReplacingCharactersInRange:range withString:str1];
    return aString;
}
+ (NSString *)addWhiteSpaceInStrForPhoneNumber:(NSString *)phoneNumer
{
    if (phoneNumer.length == 11) {
        NSString *whiteSpaceStr = @" ";
        NSString *subStr1 = [phoneNumer substringWithRange:NSMakeRange(0, 3)];
        NSString *subStr2 = [phoneNumer substringWithRange:NSMakeRange(3, 4)];
        NSString *subStr3 = [phoneNumer substringWithRange:NSMakeRange(7, 4)];
        NSString *subStr4 = [subStr1 stringByAppendingString:whiteSpaceStr];
        NSString *subStr5 = [subStr4 stringByAppendingString:subStr2];
        NSString *subStr6 = [subStr5 stringByAppendingString:whiteSpaceStr];
        NSString *subStr7 = [subStr6 stringByAppendingString:subStr3];
        return subStr7;
    }
    else
    {
        return phoneNumer;
    }
}
+ (NSString *)deleteSpecialStr:(NSString *)string
{
   NSCharacterSet *set = [NSCharacterSet characterSetWithCharactersInString:@"@／：；（）¥「」＂、[]{}#%-*+=_\\|~＜＞$€^•'@#$%^&*()_+'\""];
    NSString *trimmedString = [string stringByTrimmingCharactersInSet:set];
    return trimmedString;
}
+ (NSString *)deleteSpecialStr1:(NSString *)string
{
    NSPredicate *set = [NSPredicate predicateWithFormat:@"SELF != '-'"];
    NSArray *parts = [string componentsSeparatedByString:@"-"];
    NSArray *filteredArray = [parts filteredArrayUsingPredicate:set];
    string  = [filteredArray componentsJoinedByString:@""];
    return string;
}
+ (NSString *)checkMobilePhoneWithStr:(NSString *)phoneStr
{
    NSString *newStr;
    NSString *deleteSpaceStr = [InsureValidate deleteWhiteSpaceInStr:phoneStr];
    NSString *deleteSpecialStr = [InsureValidate deleteSpecialStr:deleteSpaceStr];
    NSString *deleteSpecialStr1 = [InsureValidate deleteSpecialStr1:deleteSpecialStr];
    if ([deleteSpecialStr1 hasPrefix:@"86"] && [deleteSpecialStr1 length] == 13) {
        newStr = [deleteSpecialStr1 substringFromIndex:2];
        return newStr;
    }
    else if (([deleteSpecialStr1 length] == 11 && [deleteSpecialStr1 characterAtIndex:0] == '1'))
    {
        return deleteSpecialStr1;
    }
    else
    {
        return nil;
    }
}
//需要用到SFHFkeychainUtils第三方
//+ (NSString *)keychainDevice
//{
//    NSString *deviceID = @"";
//    NSString *chainDevice = [NSString]
//}
+ (BOOL)validateZipCode:(NSString *)zipCode
{
    if (zipCode.length == 6) {
        return YES;
    }
    return NO;
}
@end
