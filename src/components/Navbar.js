'use client';
import React from 'react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link } from '@nextui-org/react';
import { AcmeLogo } from '/public/images/Logo.jsx';  // Ensure this path is correct
import { usePathname,useRouter } from 'next/navigation';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

export default function NavbarComponent({ ...props }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Navbar shouldHideOnScroll {...props} className='bg-leoniPrimary'>
      <NavbarBrand onClick={()=>router.push('/')} className='cursor-pointer'>
        <AcmeLogo />
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem isActive={pathname==='/'}>
          <Link
            className={pathname==='/' ? 'text-leoniAccent' : 'text-white'}
            href="/"
            aria-current={pathname==='/' ? 'page' : undefined}
          >
            Home
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathname.startsWith('/services')}>
          <Link
            className={pathname.startsWith('/services') ? 'text-leoniAccent' : 'text-white'}
            href="/services"
            aria-current={pathname.startsWith('/services') ? 'page' : undefined}
          >
            Services
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathname.startsWith('/about')}>
          <Link
            className={pathname.startsWith('/about') ? 'text-leoniAccent' : 'text-white'}
            href="/about"
            aria-current={pathname.startsWith('/about') ? 'page' : undefined}
          >
            About
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathname.startsWith('/contact')}>
          <Link
            className={pathname.startsWith('/contact') ? 'text-leoniAccent' : 'text-white'}
            href="/contact"
            aria-current={pathname.startsWith('/contact') ? 'page' : undefined}
          >
            Contact
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </NavbarItem>
        <NavbarItem>
          <SignedOut>
            <SignInButton>
              <button className="px-3 py-1 bg-blue-500 text-white font-semibold text-lg rounded-lg shadow-md hover:bg-blue-600 transition-colors">
                Sign in
              </button>
            </SignInButton>
          </SignedOut>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}