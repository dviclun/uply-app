import { withSupabase } from "npm:@supabase/server@1";

export default {
  fetch: withSupabase(
    { auth: "user" },
    async (_req, ctx) => {
      const userId = ctx.userClaims?.id;

      if (!userId) {
        return Response.json(
          { error: "No autorizado" },
          { status: 401 },
        );
      }

      const { error } = await ctx.supabaseAdmin.auth.admin.deleteUser(
        userId,
      );

      if (error) {
        return Response.json(
          {
            error: "No se ha podido eliminar la cuenta",
          },
          { status: 500 },
        );
      }

      return Response.json({
        message: "Cuenta eliminada correctamente",
      });
    },
  ),
};