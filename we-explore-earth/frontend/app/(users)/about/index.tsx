import { View, Text, Button, Alert } from 'react-native';

export default function AboutScreen() {

  const sendTestSMS = async () => {
    try {
      const response = await fetch("http://localhost:3000/twilio/send-sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: "+19514630046",
          body: "Hello from React Native 🚀"
        }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert("Success", "SMS sent!");
      } else {
        Alert.alert("Error", "Failed to send SMS");
      }

    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Network request failed");
    }
  };

  return (
    <View style={{ 
      flex: 1, 
      justifyContent: "center", 
      alignItems: "center" 
    }}>
      <Text>About Page</Text>
      <Button title="Send Test SMS" onPress={sendTestSMS} />
    </View>
  );
}