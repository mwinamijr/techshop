import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Button, FlatList, Text, TouchableOpacity, View } from "react-native";
import { db } from "../../db"; // make sure db = openDatabaseSync("shop.db")

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const rows = await db.getAllAsync("SELECT * FROM products;");
      setProducts(rows);
    } catch (err) {
      console.error("Error loading products:", err);
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      await db.runAsync("DELETE FROM products WHERE id = ?;", [id]);
      Alert.alert("Product deleted");
      loadProducts(); // reload products after deletion
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const editProduct = (product: any) => {
    router.push({
      pathname: "/add-product",
      params: { id: product.id },
    });
  };

  const sellProduct = async (product: any) => {
    try {
      let qty = 1;
      let totalPrice = qty * product.selling_price;
      let profitValue = qty * (product.selling_price - product.buying_price);

      await db.runAsync(
        "INSERT INTO sales (product_id, quantity, selling_price, total, profit, timestamp) VALUES (?, ?, ?, ?, ?, datetime('now'));",
        [product.id, qty, product.selling_price, totalPrice, profitValue]
      );

      Alert.alert("Sale recorded", `${product.name} sold for ${totalPrice} TZS`);
    } catch (err) {
      console.error("Error recording sale:", err);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, marginTop: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Products</Text>

      {/* Button to add new product */}
      <Button title="Add New Product" onPress={() => router.push("/add-product")} />

      {products.length === 0 ? (
        <Text style={{ marginTop: 20, fontStyle: "italic" }}>No products available.</Text>
      ) : (
        <FlatList
          style={{ marginTop: 20 }}
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: 10,
                borderBottomWidth: 1,
              }}
            >
              <TouchableOpacity onPress={() => sellProduct(item)} style={{ flex: 1 }}>
                <Text style={{ fontSize: 16 }}>
                  {item.name} - {item.selling_price} TZS
                </Text>
              </TouchableOpacity>

              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity onPress={() => editProduct(item)} style={{ marginRight: 15 }}>
                  <MaterialIcons name="edit" size={24} color="blue" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteProduct(item.id)}>
                  <MaterialIcons name="delete" size={24} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
