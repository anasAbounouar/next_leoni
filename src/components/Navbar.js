'use client';
import React from 'react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from '@nextui-org/react';
import { AcmeLogo } from '/public/images/Logo.jsx';  // Ensure this path is correct
import { usePathname } from 'next/navigation';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

export default function NavbarComponent({ ...props }) {
  const pathname = usePathname();

  return (
    <Navbar shouldHideOnScroll {...props}>
      <NavbarBrand>
        <AcmeLogo />
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem isActive={pathname === '/'}>
          <Link
            color={pathname === '/' ? 'primary' : 'foreground'}
            href="/"
            aria-current={pathname === '/' ? 'page' : undefined}
          >
            Home
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathname === '/services'}>
          <Link
            color={pathname === '/services' ? 'primary' : 'foreground'}
            href="/services"
            aria-current={pathname === '/services' ? 'page' : undefined}
          >
            Services
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathname === '/about'}>
          <Link
            color={pathname === '/about' ? 'primary' : 'foreground'}
            href="/about"
            aria-current={pathname === '/about' ? 'page' : undefined}
          >
            About
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathname === '/contact'}>
          <Link
            color={pathname === '/contact' ? 'primary' : 'foreground'}
            href="/contact"
            aria-current={pathname === '/contact' ? 'page' : undefined}
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
            <SignInButton />
          </SignedOut>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
