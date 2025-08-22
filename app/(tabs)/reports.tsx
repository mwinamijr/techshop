import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { db } from "../../db";

export default function Reports() {
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const rows = await db.getAllAsync("SELECT * FROM sessions ORDER BY start_time DESC;");
        setSessions(rows);
      } catch (err) {
        console.error("Error loading sessions:", err);
      }
    };

    loadSessions();
  }, []);

  return (
    <View style={{ flex: 1, padding: 20, marginTop: 40 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Reports</Text>
      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1 }}>
            <Text>Session #{item.id}</Text>
            <Text>Start: {item.start_time}</Text>
            <Text>Opening: {item.opening_cash} TZS</Text>
            <Text>Expected: {item.expected_cash ?? 0} TZS</Text>
            <Text>Closing: {item.closing_cash ?? 0} TZS</Text>
            <Text>Difference: {item.difference ?? 0} TZS</Text>
          </View>
        )}
      />
    </View>
  );
}
