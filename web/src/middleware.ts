import Negotiator from "negotiator";
import { match } from "@formatjs/intl-localematcher";
import { NextRequest, NextResponse } from "next/server";

const locales = ["en", "zh"];
const defaultLocale = "en";
const cookieName = "i18nlang";
const unauthorizedPaths = ['/auth/login', '/signup']; // 不需要认证的路径列表

// 获取首选区域设置，类似于上面的方法或使用库
function getLocale(request: NextRequest): string {
    // 从 cookie 获取区域设置
    if (request.cookies.has(cookieName))
        return request.cookies.get(cookieName)!.value;
    // 从 HTTP 标头获取接受语言
    const acceptLang = request.headers.get("Accept-Language");
    if (!acceptLang) return defaultLocale;
    // 获取匹配区域设置
    const headers = { "accept-language": acceptLang };
    const languages = new Negotiator({ headers }).languages();
    return match(languages, locales, defaultLocale);
}

export function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith("/_next")) return NextResponse.next();

    // 检查路径名中是否有任何受支持的区域设置
    const { pathname } = request.nextUrl;
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (pathnameHasLocale) return;

    // 如果没有区域设置则重定向
    const locale = getLocale(request);
    request.nextUrl.pathname = `/${locale}${pathname}`;
    // 例如传入请求是 /products
    // 新 URL 现在为 /en-US/products
    const response = NextResponse.redirect(request.nextUrl);
    // 将区域设置设置为 cookie
    response.cookies.set(cookieName, locale);

    // 检查是否需要认证
    if (!unauthorizedPaths.some((path: string) => pathname.startsWith(path))) {
        // 从请求头中获取 JWT 令牌
        const token = '';

        // 如果没有令牌或令牌无效，重定向到登录页面
        if (!token) {
            const url = request.nextUrl.clone();
            url.pathname = '/auth/login';
            return NextResponse.redirect(url);
        }
    }

    return response;
}

export const config = {
    matcher: [
        // 跳过所有内部路径 (_next)
        '/((?!_next).*)',
        // 可选：只在根 (/) URL 上运行
        // '/'
    ],
};