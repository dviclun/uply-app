export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    switch (error.message) {
      case "Invalid login credentials":
        return "El email o la contraseña no son correctos.";

      default:
        return "Ha ocurrido un error. Inténtalo de nuevo más tarde.";
    }
  }

  return "Ha ocurrido un error. Inténtalo de nuevo más tarde.";
}
