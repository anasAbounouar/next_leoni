// src/components/Navbar.jsx
'use client';
import React from 'react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from '@nextui-org/react';
import { AcmeLogo } from '/public/images/Logo.jsx';
import { usePathname } from 'next/navigation';

export default function NavbarComponent({ ...props }) {
  const pathname = usePathname();

  return (
    <Navbar shouldHideOnScroll {...props}>
      <NavbarBrand>
        <AcmeLogo />
        {/* <p className="font-bold text-inherit">LEONI</p> */}
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
        <NavbarItem className="hidden lg:flex">
          <Link href="#">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="#" variant="flat">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
