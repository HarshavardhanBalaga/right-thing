"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function ProgressPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [dailyTasks, setDailyTasks] = useState([{ tasks_done: "", time_spent: "", notes: "" }]);
  const [date, setDate] = useState(new Date());
  const [dailyUpdate, setDailyUpdate] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // ✅ Check authentication session
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/login");
      } else {
        setUser(data.session.user);
        setLoading(false);
      }
    };
    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) router.replace("/login");
      }
    );
    return () => listener.subscription.unsubscribe();
  }, [router]);

  // Format date to YYYY-MM-DD
  const formatDate = (date) => {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().split("T")[0];
  };

  // Fetch logs
  useEffect(() => {
    if (!user) return;

    const fetchLogs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("progress_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (error) console.error("Fetch failed:", error.message);
      else setLogs(data || []);
      setLoading(false);
    };

    fetchLogs();
  }, [user]);

  // Add task row
  const addTaskRow = () => setDailyTasks([...dailyTasks, { tasks_done: "", time_spent: "", notes: "" }]);

  // Handle task input
  const handleTaskChange = (index, field, value) => {
    const updated = [...dailyTasks];
    updated[index][field] = value;
    setDailyTasks(updated);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);

    const formattedDate = formatDate(date);

    const tasksToInsert = dailyTasks
      .filter((task) => task.tasks_done && task.time_spent)
      .map((task) => ({
        user_id: user.id,
        date: formattedDate,
        tasks_done: task.tasks_done,
        time_spent: task.time_spent,
        notes: task.notes,
        daily_update: dailyUpdate,
      }));

    if (!tasksToInsert.length) {
      alert("Please fill at least one task with Tasks Done and Time Spent.");
      setSubmitting(false);
      return;
    }

    const { error } = await supabase.from("progress_logs").insert(tasksToInsert);

    if (error) {
      console.error("Insert failed:", error.message);
      setSubmitting(false);
      return;
    }

    // Reset form & refresh logs
    setSubmitted(true);
    setDailyTasks([{ tasks_done: "", time_spent: "", notes: "" }]);
    setDailyUpdate("");
    setDate(new Date());

    const { data } = await supabase
      .from("progress_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false });
    setLogs(data || []);

    setSubmitting(false);
  };

  if (loading) return <p>Loading progress...</p>;
  if (!user) return null;

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl mb-4">Progress Tracker</h1>

      {/* ✅ Back to Dashboard button */}
      <button
        onClick={() => router.push("/dashboard")}
        className="mb-4 text-blue-500 border border-blue-500 px-3 py-1 rounded"
      >
        ← Back to Dashboard
      </button>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-2">
          <label>
            Date:
            <input
              type="date"
              value={formatDate(date)}
              onChange={(e) => setDate(new Date(e.target.value))}
              className="border p-1 w-full"
            />
          </label>

          {dailyTasks.map((task, index) => (
            <div key={index} className="border p-2 rounded mb-2">
              <label>
                Tasks Done*:
                <input
                  type="text"
                  value={task.tasks_done}
                  onChange={(e) => handleTaskChange(index, "tasks_done", e.target.value)}
                  className="border p-1 w-full"
                  required
                />
              </label>

              <label>
                Time Spent*:
                <input
                  type="text"
                  value={task.time_spent}
                  onChange={(e) => handleTaskChange(index, "time_spent", e.target.value)}
                  className="border p-1 w-full"
                  required
                />
              </label>

              <label>
                Notes:
                <textarea
                  value={task.notes}
                  onChange={(e) => handleTaskChange(index, "notes", e.target.value)}
                  className="border p-1 w-full"
                />
              </label>
            </div>
          ))}

          <button type="button" className="bg-gray-200 text-black py-1 px-3 rounded" onClick={addTaskRow}>
            Add Another Task
          </button>

          <label>
            Daily Update:
            <textarea
              value={dailyUpdate}
              onChange={(e) => setDailyUpdate(e.target.value)}
              placeholder="Write a summary of the day..."
              className="border p-1 w-full mt-2"
            />
          </label>

          <button
            type="submit"
            className={`mt-2 py-1 px-3 rounded text-white ${submitting ? "bg-gray-400" : "bg-blue-500"}`}
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Save Daily Update"}
          </button>
        </form>
      ) : (
        <div>
          <p className="bg-green-100 text-green-800 p-4 rounded text-center text-lg mb-4">
            Well done! Come tomorrow with the same energy 💪
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="w-full bg-blue-500 text-white py-2 px-3 rounded"
          >
            Add More Progress
          </button>
        </div>
      )}

     
    </div>
  );
}
