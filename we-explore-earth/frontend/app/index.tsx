//STANDARD LIBRARY
//THIRD-PARTY LIBRARIES
import { Redirect } from "expo-router";
//LOCAL FILES

export default function Index() {
  return <Redirect href="/(admin)/home" />;
}
