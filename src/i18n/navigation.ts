"use client";

import {createNavigation} from 'next-intl/navigation';
import {routing} from './routing';

export const {Link, usePathname, useRouter, redirect, getPathname} =
  createNavigation(routing);


