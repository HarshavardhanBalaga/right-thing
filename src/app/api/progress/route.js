import { supabase } from "@/lib/supabaseClient"

export async function POST(req) {
  try {
    // 1️⃣ Get access token from Authorization header
    const authHeader = req.headers.get('Authorization')
    const token = authHeader?.split(' ')[1]

    if (!token) {
      return Response.json({ error: "Not logged in" }, { status: 401 })
    }

    // 2️⃣ Get user info from token
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    if (userError || !user) {
      return Response.json({ error: "Invalid token" }, { status: 401 })
    }

    const body = await req.json()
    const { date, tasks_done, time_spent, notes } = body

    if (!date || !tasks_done || !time_spent) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    // 3️⃣ Insert progress log with user_id from session
    const { data, error } = await supabase
      .from("progress_logs")
      .insert([{ user_id: user.id, date, tasks_done, time_spent, notes }])

    if (error) return Response.json({ error: error.message }, { status: 400 })

    return Response.json({ success: true, data }, { status: 200 })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const user_id = searchParams.get("user_id")

    if (!user_id) return Response.json({ error: "Missing user_id" }, { status: 400 })

    const { data, error } = await supabase
      .from("progress_logs")
      .select("*")
      .eq("user_id", user_id)
      .order("date", { ascending: false })

    if (error) return Response.json({ error: error.message }, { status: 400 })
    return Response.json({ data }, { status: 200 })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
