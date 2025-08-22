import { useEffect, useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { db } from "../../db";

export default function Session() {
  const [openingCash, setOpeningCash] = useState("");
  const [closingCash, setClosingCash] = useState("");
  const [session, setSession] = useState<any>(null);

  // Load active session on mount
  useEffect(() => {
    const loadActiveSession = async () => {
      const rows = await db.getAllAsync(
        "SELECT * FROM sessions WHERE end_time IS NULL;"
      );
      if (rows.length > 0) {
        setSession(rows[0]);
      }
    };
    loadActiveSession();
  }, []);

  const startSession = async () => {
    try {
      const open = parseFloat(openingCash);
      await db.runAsync(
        "INSERT INTO sessions (start_time, opening_cash) VALUES (datetime('now'), ?);",
        [open]
      );
      Alert.alert("Session Started");
      setSession({ opening_cash: open });
    } catch (err) {
      console.error("Error starting session:", err);
    }
  };

  const closeSession = async () => {
    try {
      // get total sales
      const rows = await db.getAllAsync("SELECT SUM(total) as totalSales FROM sales;");
      let totalSales = rows[0]?.totalSales || 0;

      let expected = (session.opening_cash || 0) + totalSales;
      let closing = parseFloat(closingCash);
      let diff = closing - expected;

      await db.runAsync(
        "UPDATE sessions SET end_time=datetime('now'), closing_cash=?, expected_cash=?, difference=? WHERE end_time IS NULL;",
        [closing, expected, diff]
      );

      Alert.alert("Session Closed", `Difference: ${diff}`);
      setSession(null);
    } catch (err) {
      console.error("Error closing session:", err);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, marginTop: 40 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Session</Text>
      {session ? (
        <>
          <Text>Session Opened with {session.opening_cash} TZS</Text>
          <TextInput
            placeholder="Enter closing cash"
            value={closingCash}
            onChangeText={setClosingCash}
            keyboardType="numeric"
            style={{ borderWidth: 1, padding: 8, marginVertical: 10 }}
          />
          <Button title="Close Session" onPress={closeSession} />
        </>
      ) : (
        <>
          <TextInput
            placeholder="Enter opening cash"
            value={openingCash}
            onChangeText={setOpeningCash}
            keyboardType="numeric"
            style={{ borderWidth: 1, padding: 8, marginVertical: 10 }}
          />
          <Button title="Start Session" onPress={startSession} />
        </>
      )}
    </View>
  );
}
