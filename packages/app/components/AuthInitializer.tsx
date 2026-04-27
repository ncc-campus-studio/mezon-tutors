'use client';

import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { initAuthAtom } from '@mezon-tutors/app/store/auth.atom';

export default function AuthInitializer() {
  const initAuth = useSetAtom(initAuthAtom);

  useEffect(() => {
    void initAuth();
  }, [initAuth]);

  return null;
}
