import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';
import type { User } from '../api/types';
import { getMe, login as apiLogin, register as apiRegister } from '../api/auth';

interface AuthContextValue {
    user: User | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

// ✅ 不要用 any
// ❌ createContext<any>(null);
// ✅ 正确写法：
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setLoading(false);
            return;
        }
        (async () => {
            try {
                const me = await getMe();
                setUser(me);
            } catch {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const login = async (username: string, password: string) => {
        const tokens = await apiLogin(username, password);
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        const me = await getMe();
        setUser(me);
    };

    const register = async (username: string, password: string) => {
        await apiRegister(username, password);
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
    };

    const value: AuthContextValue = {
        user,
        loading,
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ✅ 明确声明返回类型，避免 any
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return ctx;
}
