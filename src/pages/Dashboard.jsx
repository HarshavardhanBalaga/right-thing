"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Calendar } from "@/components/ui/calendar";
import Streaks from "@/components/Streaks";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dayLogs, setDayLogs] = useState([]);
  const [fetchingLogs, setFetchingLogs] = useState(false);

  // ✅ Check login session
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) router.replace("/login");
      else {
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

  // Logout function
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Logout error:", error.message);
    else router.replace("/login");
  };

  // Helper: format date in YYYY-MM-DD (ignore timezone)
  const formatDate = (date) => {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().split("T")[0];
  };

  // Fetch logs for selected date
  useEffect(() => {
    if (!user || !selectedDate) return;

    const fetchLogs = async () => {
      setFetchingLogs(true);

      const formattedDate = formatDate(selectedDate);
      console.log("Fetching logs for:", formattedDate);

      const { data, error } = await supabase
        .from("progress_logs")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", formattedDate);

      if (error) console.error("Error fetching logs:", error.message);
      else {
        console.log("Logs returned:", data);
        setDayLogs(data || []);
      }

      setFetchingLogs(false);
    };

    fetchLogs();
  }, [selectedDate, user]);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <>
      {/* Header with user email and logout */}
      <div className="fixed top-0 left-0 w-screen shadow shadow-orange-300 p-3 flex justify-between items-center">
        <h1 className="text-lg font-semibold">Welcome, {user?.email}</h1>
        <button
          className="text-blue-500 border border-blue-500 px-3 py-1 rounded"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Main content */}
      <div className="flex mt-16">
        {/* Left 2/3 */}
        <div className="w-2/3 text-white h-[92vh] p-4 overflow-y-auto">
          <Streaks />

          <div className="mt-6">
            {/* ✅ FIXED: Wrapped router.push in arrow function */}
            <button 
              onClick={() => router.push("/progress")} 
              className="text-sm border-2 border-green-900 text-green-700 py-1 px-2 rounded"
            >
              add progress
            </button>
            {fetchingLogs ? (
              <p>Loading logs...</p>
            ) : dayLogs.length > 0 ? (
              <>
                <h2 className="text-lg font-semibold mb-2">
                  Progress on {formatDate(selectedDate)}
                </h2>
                {dayLogs.map((log) => (
                  <div
                    key={log.id}
                    className="border border-gray-700 p-3 rounded mb-3"
                  >
                    <p><strong>Task:</strong> {log.tasks_done}</p>
                    <p><strong>Time:</strong> {log.time_spent}</p>
                    {log.notes && <p><strong>Notes:</strong> {log.notes}</p>}
                    {log.daily_update && (
                      <p><strong>Daily Update:</strong> {log.daily_update}</p>
                    )}
                  </div>
                ))}
              </>
            ) : (
              <p className="text-gray-300">No progress logged for this date.</p>
            )}
          </div>
        </div>

        {/* Right 1/3 */}
        <div className="w-1/3 h-[92vh] p-4 border-l">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date) setSelectedDate(date);
            }}
            className="rounded-md border shadow-sm"
          />
          <div className="mt-6">
            <p>Task Manager will go here.</p>
          </div>
        </div>
      </div>
    </>
  );
}
