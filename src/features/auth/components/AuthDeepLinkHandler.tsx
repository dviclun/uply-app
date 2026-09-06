import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import { useEffect } from "react";

import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers";
import { setPasswordRecoveryMode } from "@/utils";

async function handleAuthUrl(
  url: string,
  setPasswordRecoveryActive: (active: boolean) => void,
) {
  const { params, errorCode } = QueryParams.getQueryParams(url);

  if (errorCode) {
    console.error("AUTH DEEP LINK ERROR:", errorCode);
    return;
  }

  const { access_token, refresh_token } = params;

  if (typeof access_token !== "string" || typeof refresh_token !== "string") {
    return;
  }

  const parsedUrl = Linking.parse(url);

  const isPasswordRecovery = parsedUrl.path === "reset-password";
  const isAuthCallback = parsedUrl.path === "callback";

  if (isPasswordRecovery) {
    setPasswordRecoveryActive(true);
    void setPasswordRecoveryMode(true);
  }

  const { error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });

  if (error) {
    console.error("AUTH SESSION ERROR:", error);
    return;
  }

  if (isPasswordRecovery) {
    router.replace("/auth/reset-password");
    return;
  }

  if (isAuthCallback) {
    router.replace("/(app)/(tabs)");
  }
}

export function AuthDeepLinkHandler() {
  const { setPasswordRecoveryActive, setAuthDeepLinkReady } = useAuth();

  useEffect(() => {
    let mounted = true;

    const handleUrl = async (url: string) => {
      const parsedUrl = Linking.parse(url);

      const isRecovery = parsedUrl.path === "reset-password";
      const isCallback = parsedUrl.path === "callback";

      if (!isRecovery && !isCallback) {
        return;
      }

      await handleAuthUrl(url, setPasswordRecoveryActive);

      if (mounted) {
        setAuthDeepLinkReady(true);
      }
    };

    const handleInitialUrl = async () => {
      const url = await Linking.getInitialURL();

      if (!mounted) {
        return;
      }

      if (url) {
        await handleUrl(url);
        return;
      }

      if (mounted) {
        setAuthDeepLinkReady(true);
      }
    };

    const subscription = Linking.addEventListener("url", ({ url }) => {
      handleUrl(url);
    });

    handleInitialUrl();

    return () => {
      mounted = false;
      subscription.remove();
    };
  }, [setAuthDeepLinkReady, setPasswordRecoveryActive]);

  return null;
}
