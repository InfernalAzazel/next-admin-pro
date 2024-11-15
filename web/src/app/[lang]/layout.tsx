import { Inter } from 'next/font/google';
import '../globals.css';
import React from 'react';
import { getDictionary } from '@/app/[lang]/dictionaries';
import { AntdRegistry } from '@ant-design/nextjs-registry';

interface Params{
    lang: string;
}

interface RootProps {
    children: React.ReactNode;
    params: Params;
}

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata({ params }: { params: Params }) {
    const t = await getDictionary(params.lang);
    return {
        title: t.page.title,
        description: t.page.desc,
    };
}

export async function generateStaticParams() {
    return [{ lang: 'en' }, { lang: 'zh' }];
}

export default function Root({ children, params }: RootProps) {
    return (
        <html lang={params.lang}>
        <body className={inter.className}>
        <AntdRegistry>{children}</AntdRegistry>
        </body>
        </html>
    );
}