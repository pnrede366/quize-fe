import { useEffect, useState } from "react";
import { message } from "antd";
import { io } from "socket.io-client";
import { userAPI } from "../../../api/api";

export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    try {
      const data = await userAPI.getLeaderboard();
      setLeaderboard(data);
    } catch (error) {
      message.error("Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();

    // Connect to Socket.IO for real-time updates
    const socket = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000');

    socket.on('connect', () => {
      console.log('Connected to Socket.IO');
    });

    socket.on('leaderboard-update', (data) => {
      console.log('Leaderboard update received:', data);
      fetchLeaderboard();
      message.success(`${data.username} just scored points! 🎉`, 3);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return { leaderboard, loading };
}

