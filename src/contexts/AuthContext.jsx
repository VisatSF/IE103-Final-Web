import React, { createContext, useContext, useEffect, useState } from 'react';
import { loginApi, registerApi } from '@/lib/api.js';

const CURRENT_USER_KEY = 'jobillee_current_user';
const USER_META_KEY = 'jobillee_user_meta';

const AuthContext = createContext(null);

function readUserMeta() {
  try {
    return JSON.parse(localStorage.getItem(USER_META_KEY) || '{}');
  } catch {
    return {};
  }
}

function writeUserMeta(meta) {
  localStorage.setItem(USER_META_KEY, JSON.stringify(meta));
}

function getMetaForEmail(email) {
  if (!email) {
    return {};
  }

  const meta = readUserMeta();
  return meta[email.toLowerCase()] || {};
}

function saveMetaForEmail(email, nextMeta) {
  if (!email) {
    return;
  }

  const meta = readUserMeta();
  meta[email.toLowerCase()] = {
    ...(meta[email.toLowerCase()] || {}),
    ...nextMeta,
  };
  writeUserMeta(meta);
}

function normalizeUser(user) {
  if (!user) {
    return null;
  }

  const meta = getMetaForEmail(user.email);
  const displayName = meta.fullName || user.fullName || user.name || '';

  return {
    ...user,
    fullName: displayName,
    name: displayName,
    avatar: meta.avatar || user.avatar || '',
    dateOfBirth: meta.dateOfBirth || '',
    addresses: Array.isArray(meta.addresses) ? meta.addresses : [],
  };
}

function persistUser(user) {
  if (!user) {
    localStorage.removeItem(CURRENT_USER_KEY);
    return null;
  }

  const normalized = normalizeUser(user);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(normalized));
  return normalized;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (storedUser) {
      try {
        setUser(normalizeUser(JSON.parse(storedUser)));
      } catch (error) {
        console.error('Failed to parse stored user', error);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const result = await loginApi({ email, password });
      const nextUser = persistUser(result.user);
      setUser(nextUser);
      return { success: true, user: nextUser };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const signup = async (fullName, email, password, phone = '') => {
    try {
      const result = await registerApi({ fullName, email, password, phone });
      const nextUser = persistUser(result.user);
      setUser(nextUser);
      return { success: true, user: nextUser };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    persistUser(null);
  };

  const updateProfile = (data) => {
    if (!user) {
      return { success: false, message: 'Chưa đăng nhập' };
    }

    const metaPatch = {
      ...(data.avatar !== undefined ? { avatar: data.avatar } : {}),
      ...(data.dateOfBirth !== undefined ? { dateOfBirth: data.dateOfBirth } : {}),
      ...(data.addresses !== undefined ? { addresses: data.addresses } : {}),
      ...(data.phone !== undefined ? { phone: data.phone } : {}),
      ...(data.name !== undefined ? { fullName: data.name } : {}),
      ...(data.fullName !== undefined ? { fullName: data.fullName } : {}),
    };

    saveMetaForEmail(user.email, metaPatch);

    const updatedUser = persistUser({
      ...user,
      fullName: data.fullName ?? data.name ?? user.fullName,
      phone: data.phone ?? user.phone,
      avatar: data.avatar ?? user.avatar,
      dateOfBirth: data.dateOfBirth ?? user.dateOfBirth,
      addresses: data.addresses ?? user.addresses,
    });

    setUser(updatedUser);
    return { success: true };
  };

  const addAddress = (address) => {
    if (!user) {
      return { success: false, message: 'Vui lòng đăng nhập' };
    }

    const currentAddresses = user.addresses || [];
    const newAddress = { ...address, id: Date.now() };
    const updatedAddresses = [...currentAddresses, newAddress];

    return updateProfile({ addresses: updatedAddresses });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        updateProfile,
        addAddress,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
