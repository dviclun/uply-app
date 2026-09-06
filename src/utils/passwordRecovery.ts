import AsyncStorage from "@react-native-async-storage/async-storage";

const PASSWORD_RECOVERY_KEY = "uply:password-recovery";

export async function setPasswordRecoveryMode(enabled: boolean): Promise<void> {
  if (enabled) {
    await AsyncStorage.setItem(PASSWORD_RECOVERY_KEY, "true");
    return;
  }

  await AsyncStorage.removeItem(PASSWORD_RECOVERY_KEY);
}

export async function isPasswordRecoveryMode(): Promise<boolean> {
  const value = await AsyncStorage.getItem(PASSWORD_RECOVERY_KEY);

  return value === "true";
}
