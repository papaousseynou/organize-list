import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import EditWatch from "../components/EditWatch";
import WatchForm from "../components/WatchForm";
import { deleteWatch } from "../server-actions/deleteWatch";

export default async function WatchList() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user;

  const { data: watches, error } = await supabase
    .from("watches")
    .select("*")
    .eq("user_id", user.id)
    .order("brand", { ascending: true });

  if (error) {
    console.error("Erreur de recuperation des watches");
  }

  return (
    <div className="min-h-screen text-gray-300 bg-gray-900">
      <div className="container p-6 mx-auto sm:p-12">
        <div className="flex items-start justify-between">
          <h1 className="mb-6 text-5xl font-extrabold text-white md:text-6xl">
            My Watch List
          </h1>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="px-4 py-2 font-bold text-white bg-gray-600 rounded hover:bg-gray-700"
            >
              Deconnexion
            </button>
          </form>
        </div>
        <WatchForm />
        <div className="mt-6">
          {watches.map((watch) => (
            <div
              key={watch.id}
              className="p-4 mb-4 bg-gray-800 rounded-lg shadow"
            >
              <h2 className="mb-2 text-xl text-white">
                {watch.brand} - {watch.model}
              </h2>
              <div className="flex space-x-2">
                <form action={deleteWatch}>
                  <input type="hidden" name="id" value={watch.id} />
                  <button
                    type="submit"
                    className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700"
                  >
                    Supprimer
                  </button>
                </form>
                <EditWatch watch={watch} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
