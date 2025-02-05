import React, { useState } from "react";
import { View, Button, Alert } from "react-native";
import { WebView } from "react-native-webview";

const PaymentScreen = () => {
  const [paymentUrl, setPaymentUrl] = useState(null);

  // Function to initiate the payment process
  const startPayment = async () => {
    const amount = 1000; // Amount for the transaction
    const refId = "order123"; // Unique reference ID for the transaction

    // Payment details to send to the backend for generating the payment URL
    const params = new URLSearchParams();
    params.append("merchantId", "EPAYTEST"); // Replace with actual merchant ID
    params.append("amount", amount.toString());
    params.append("refId", refId);
    params.append("apiKey", "your-api-key"); // Replace with your actual API key

    try {
      // Send POST request to backend for generating payment URL
      const response = await fetch(
        "https://your-backend-url/generate-payment-url",
        {
          method: "POST",
          body: params,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      // Parse response and check if payment URL is provided
      const data = await response.json();
      if (data.paymentUrl) {
        setPaymentUrl(data.paymentUrl); // Set payment URL to open in WebView
      } else {
        Alert.alert("Error", "Unable to generate payment link");
      }
    } catch (error) {
      console.error("Payment error:", error);
      Alert.alert("Error", "Failed to initiate payment");
    }
  };

  // Function to handle navigation state changes in WebView
  const handleNavigationStateChange = (navState) => {
    // Check for successful or failed payment
    if (navState.url.includes("payment/success")) {
      Alert.alert("Payment Success", "Your payment was successful!");
      // Handle any additional actions after payment success, like updating your backend
    } else if (navState.url.includes("payment/failed")) {
      Alert.alert("Payment Failed", "The payment process failed.");
      // Handle any fallback actions after payment failure
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Show the payment button if the URL is not available */}
      {!paymentUrl ? (
        <Button title="Pay with eSewa" onPress={startPayment} />
      ) : (
        // Once the payment URL is set, show the WebView to process the payment
        <WebView
          source={{ uri: paymentUrl }} // Use the generated payment URL
          onNavigationStateChange={handleNavigationStateChange} // Handle success or failure of payment
          startInLoadingState={true} // Show loading indicator while the payment page is loading
        />
      )}
    </View>
  );
};

export default PaymentScreen;
