import { View, Text, TouchableOpacity } from "react-native";
import { Product } from "./types";

type Props = {
  product: Product;
  onPurchase: () => void;
};

export default function StoreItemCard({ product, onPurchase }: Props) {
  return (
    <View style={{ padding: 16, marginBottom: 12, backgroundColor: "#fff", borderRadius: 8 }}>
      <Text style={{ fontWeight: "bold" }}>{product.name}</Text>
      <Text>{product.description}</Text>
      <Text>{product.price} points</Text>

      <TouchableOpacity onPress={onPurchase}>
        <Text style={{ color: "green" }}>Buy</Text>
      </TouchableOpacity>
    </View>
  );
}