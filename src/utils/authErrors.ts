export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    switch (error.message) {
      case "Invalid login credentials":
        return "El email o la contraseña no son correctos.";

      case "New password should be different from the old password.":
        return "La nueva contraseña debe ser diferente de la anterior.";

      default:
        return "Ha ocurrido un error. Inténtalo de nuevo más tarde.";
    }
  }

  return "Ha ocurrido un error. Inténtalo de nuevo más tarde.";
}
