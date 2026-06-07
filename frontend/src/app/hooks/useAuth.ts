import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getMe, type User } from '../lib/api';

interface AuthState {
  loading: boolean;
  user: User | null;
}

export function useRequireAuth(): AuthState {
  const navigate = useNavigate();
  const [state, setState] = useState<AuthState>({ loading: true, user: null });

  useEffect(() => {
    let active = true;
    getMe()
      .then((res) => {
        if (!active) return;
        if (res.authenticated && res.user) {
          setState({ loading: false, user: res.user });
        } else {
          navigate('/', { replace: true });
        }
      })
      .catch(() => {
        if (active) navigate('/', { replace: true });
      });
    return () => {
      active = false;
    };
  }, [navigate]);

  return state;
}
