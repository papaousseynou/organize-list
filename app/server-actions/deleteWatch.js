"use server";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function deleteWatch(formData) {
  const watchId = formData.get("id");

  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user;

  if (!user) {
    console.error(
      "L'utilisateur n'est pas authentifié avec les actions du serveur deleteWatch"
    );
    return;
  }

  const { error } = await supabase
    .from("watches")
    .delete()
    .match({ id: watchId, user_id: user.id });

  if (error) {
    console.error("Erreur de suppression de données", error);
    return;
  }
  revalidatePath("/watch-list");
  return { message: "Success" };
}
