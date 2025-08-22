import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { db } from "../../db";

export default function Dashboard() {
  const [total, setTotal] = useState(0);
  const [profit, setProfit] = useState(0);

  const loadSales = async () => {
    try {
      const rows = await db.getAllAsync("SELECT * FROM sales;");
      let totalSales = 0;
      let totalProfit = 0;
      rows.forEach(s => {
        totalSales += s.total;
        totalProfit += s.profit;
      });
      setTotal(totalSales);
      setProfit(totalProfit);
    } catch (err) {
      console.error("Error loading sales:", err);
    }
  };

  useEffect(() => {
    loadSales();
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Dashboard</Text>
      <Text>Total Sales: {total} TZS</Text>
      <Text>Total Profit: {profit} TZS</Text>
    </View>
  );
}
