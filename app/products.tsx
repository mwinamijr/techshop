import { View, Text, Button, FlatList, Alert } from "react-native";
import { useEffect, useState } from "react";
import { db } from "../db"; // make sure db = openDatabaseSync("shop.db")

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const init = async () => {
      // check if products exist
      const rows = await db.getAllAsync("SELECT * FROM products;");

      if (rows.length === 0) {
        // insert sample products
        await db.runAsync(
          "INSERT INTO products (name, buying_price, selling_price) VALUES (?, ?, ?);",
          ["Sugar", 2500, 3000]
        );
        await db.runAsync(
          "INSERT INTO products (name, buying_price, selling_price) VALUES (?, ?, ?);",
          ["Rice", 3500, 4000]
        );
      }

      loadProducts();
    };

    init();
  }, []);

  const loadProducts = async () => {
    const rows = await db.getAllAsync("SELECT * FROM products;");
    setProducts(rows);
  };

  const sellProduct = async (product: any) => {
    let qty = 1;
    let totalPrice = qty * product.selling_price;
    let profitValue = qty * (product.selling_price - product.buying_price);

    await db.runAsync(
      "INSERT INTO sales (product_id, quantity, selling_price, total, profit, timestamp) VALUES (?, ?, ?, ?, ?, datetime('now'));",
      [product.id, qty, product.selling_price, totalPrice, profitValue]
    );

    Alert.alert("Sale recorded", `${product.name} sold for ${totalPrice}`);
  };

  return (
    <View style={{ flex: 1, padding: 20, marginTop: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Products</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Button title={item.name} onPress={() => sellProduct(item)} />
        )}
      />
    </View>
  );
}
