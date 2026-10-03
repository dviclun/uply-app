import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import type { Session, User } from "@supabase/supabase-js";

import * as Linking from "expo-linking";

import { supabase } from "@/lib/supabase";
import { isPasswordRecoveryMode, setPasswordRecoveryMode } from "@/utils";

type SignUpData = {
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
  initialBalance: number;
};

type SignUpResult = {
  requiresEmailConfirmation: boolean;
  email: string;
};

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;

  passwordRecoveryActive: boolean;
  setPasswordRecoveryActive: (active: boolean) => void;

  authDeepLinkReady: boolean;
  setAuthDeepLinkReady: (ready: boolean) => void;

  signUp: (data: SignUpData) => Promise<SignUpResult>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  verifyCurrentPassword: (email: string, password: string) => Promise<void>;
  resendConfirmationEmail: (email: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<void>;
  reauthenticate: () => Promise<void>;
  updatePasswordAfterReauthentication: (
    currentPassword: string,
    newPassword: string,
    nonce: string,
  ) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [passwordRecoveryActive, setPasswordRecoveryActive] = useState(false);

  const [authDeepLinkReady, setAuthDeepLinkReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initializeSession = async () => {
      try {
        setLoading(true);

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (!mounted) {
          return;
        }

        const recoveryMode = await isPasswordRecoveryMode();

        if (recoveryMode) {
          setSession(null);
          setUser(null);

          try {
            await supabase.auth.signOut({ scope: "local" });
          } catch (error) {
            console.error("AUTH INIT: RECOVERY SIGN OUT ERROR:", error);
          }

          await setPasswordRecoveryMode(false);

          if (!mounted) {
            return;
          }

          setSession(null);
          setUser(null);
          setPasswordRecoveryActive(false);

          return;
        }

        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("AUTH INITIALIZATION ERROR:", error);

        if (!mounted) {
          return;
        }

        setSession(null);
        setUser(null);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) {
        return;
      }

      if (event === "PASSWORD_RECOVERY") {
        return;
      }

      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async ({
    email,
    password,
    username,
    firstName,
    lastName,
    initialBalance,
  }: SignUpData): Promise<SignUpResult> => {
    const redirectTo = Linking.createURL("auth/callback");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          first_name: firstName,
          last_name: lastName,
          initial_balance: initialBalance,
        },
        emailRedirectTo: redirectTo,
      },
    });

    if (error) {
      throw error;
    }

    return {
      requiresEmailConfirmation: data.session === null,
      email,
    };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    setSession(null);
    setUser(null);
  };

  const deleteAccount = async (): Promise<void> => {
    const { error } = await supabase.functions.invoke("delete-account");

    if (error) {
      throw error;
    }

    await supabase.auth.signOut({ scope: "local" });

    setSession(null);
    setUser(null);
  };

  const verifyCurrentPassword = async (
    email: string,
    currentPassword: string,
  ): Promise<void> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    });

    if (error) {
      throw error;
    }
  };

  const resendConfirmationEmail = async (email: string): Promise<void> => {
    const redirectTo = Linking.createURL("auth/callback");

    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    if (error) {
      throw error;
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    const redirectTo = Linking.createURL("auth/reset-password");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      throw error;
    }
  };

  const updatePassword = async (password: string): Promise<void> => {
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      throw error;
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string,
  ): Promise<void> => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
      current_password: currentPassword,
    });

    if (error) throw error;
  };

  const reauthenticate = async (): Promise<void> => {
    const { error } = await supabase.auth.reauthenticate();

    if (error) {
      throw error;
    }
  };

  const updatePasswordAfterReauthentication = async (
    currentPassword: string,
    newPassword: string,
    nonce: string,
  ): Promise<void> => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
      current_password: currentPassword,
      nonce,
    });

    if (error) throw error;
  };
  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,

        passwordRecoveryActive,
        setPasswordRecoveryActive,

        authDeepLinkReady,
        setAuthDeepLinkReady,

        signUp,
        signIn,
        signOut,
        deleteAccount,
        verifyCurrentPassword,
        resendConfirmationEmail,
        resetPassword,
        updatePassword,
        changePassword,
        reauthenticate,
        updatePasswordAfterReauthentication,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider.");
  }

  return context;
}
