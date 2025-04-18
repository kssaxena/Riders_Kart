import React, { useEffect } from "react";

// Replace with your public VAPID key from the backend
// const publicVapidKey = publicVapidKey;

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function registerServiceWorker() {
  if ("serviceWorker" in navigator && "PushManager" in window) {
    const registration = await navigator.serviceWorker.register(
      "/service-worker.js"
    );
    return registration;
  } else {
    console.warn("Push messaging is not supported");
    return null;
  }
}

async function subscribeUser(deliveryPartnerId) {
  try {
    const registration = await registerServiceWorker();
    if (!registration) return;

    // Ask for user permission to display notifications
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Notification permission denied");
      return;
    }

    // Subscribe the user to push notifications
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(process.env.publicVapidKey),
    });

    // Send the subscription object to the backend to store it
    await fetch("/api/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        deliveryPartnerId, // ID of the delivery partner
        subscription,
      }),
    });
    console.log("Subscribed for notifications successfully");
  } catch (error) {
    console.error("Error subscribing to notifications:", error);
  }
}

export default function NotificationSetup({ deliveryPartnerId }) {
  useEffect(() => {
    // Subscribe the delivery partner when the component mounts
    subscribeUser(deliveryPartnerId);
  }, [deliveryPartnerId]);

  return <div>Notification setup complete</div>;
}
