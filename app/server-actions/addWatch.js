"use server";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function addWatch(formData) {
  const model = formData.get("model");
  const brand = formData.get("brand");
  const referenceNumber = formData.get("referenceNumber");

  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user;

  if (!user) {
    console.error(
      "L'utilisateur n'est pas authentifié avec les actions du serveur addWatch"
    );
    return;
  }

  const { data, error } = await supabase
    .from("watches")
    .insert([
      { model, brand, reference_number: referenceNumber, user_id: user.id },
    ]);

  if (error) {
    console.error("Erreur lors de l'insertion du watch");
    return;
  }
  revalidatePath("/watch-list");
  return { message: "Success" };
}
