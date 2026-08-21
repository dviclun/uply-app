import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import { useEffect } from "react";

import { supabase } from "@/lib/supabase";

async function handleAuthUrl(url: string) {
  const { params, errorCode } = QueryParams.getQueryParams(url);

  if (errorCode) {
    console.error("AUTH DEEP LINK ERROR:", errorCode);
    return;
  }

  const { access_token, refresh_token } = params;

  if (typeof access_token !== "string" || typeof refresh_token !== "string") {
    return;
  }

  const { error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });

  if (error) {
    console.error("AUTH SESSION ERROR:", error);
    return;
  }

  router.replace("/(tabs)");
}

export function AuthDeepLinkHandler() {
  useEffect(() => {
    const handleInitialUrl = async () => {
      const url = await Linking.getInitialURL();

      if (url) {
        await handleAuthUrl(url);
      }
    };

    handleInitialUrl();

    const subscription = Linking.addEventListener("url", ({ url }) => {
      handleAuthUrl(url);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return null;
}
