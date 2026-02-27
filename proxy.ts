import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/auth/auth";


export default async function proxy(requset: NextRequest) {
    const session = await getSession()

    const isDashboardPage = requset.nextUrl.pathname.startsWith('/dashboard')
    if (isDashboardPage && !session?.user) {
        return NextResponse.redirect(new URL('/login', requset.url))
    }

    const isLoginPage = requset.nextUrl.pathname.startsWith('/login')
    const isSignUpPage = requset.nextUrl.pathname.startsWith('/signup')

    if ((isLoginPage || isSignUpPage) && session?.user) {
        return NextResponse.redirect(new URL('/dashboard', requset.url))
    }

    return NextResponse.next()
}