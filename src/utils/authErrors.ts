export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    switch (error.message) {
      case "Invalid login credentials":
        return "El email o la contraseña no son correctos.";

      case "New password should be different from the old password.":
        return "La nueva contraseña debe ser diferente de la anterior.";

      case "Current password required when setting new password.":
        return "La contraseña actual no es correcta. Inténtelo de nuevo.";

      case "Password update requires reauthentication":
        return "Se requiere reautenticación para cambiar la contraseña";

      case "Nonce has expired or is invalid":
        return "El código ha expirado o no es valido";

      default:
        return "Ha ocurrido un error. Inténtalo de nuevo más tarde.";
    }
  }

  return "Ha ocurrido un error. Inténtalo de nuevo más tarde.";
}
