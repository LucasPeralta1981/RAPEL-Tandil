Build Error
Failed to compile

Next.js (14.2.35) is outdated (learn more)
./src/app/catalog/page.js:3:1
Module not found: Can't resolve '@/components/ProductCard'
  1 | 'use client';
  2 | import { useState, useEffect } from 'react';
> 3 | import ProductCard from '@/components/ProductCard'; // ✅ CAMBIO AQUÍ
    | ^
  4 | import { useSession } from 'next-auth/react';
  5 |
  6 | export default function CatalogPage() {

https://nextjs.org/docs/messages/module-not-found