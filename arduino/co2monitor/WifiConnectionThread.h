void printWifiStatus()
{
  if(DEBUG) {
    // print the SSID of the network you're attached to:
    Serial.print("SSID: ");
    Serial.println(LWiFi.SSID());

    // print your WiFi shield's IP address:
    IPAddress ip = LWiFi.localIP();
    Serial.print("IP Address: ");
    Serial.println(ip);

    Serial.print("subnet mask: ");
    Serial.println(LWiFi.subnetMask());

    Serial.print("gateway IP: ");
    Serial.println(LWiFi.gatewayIP());

    // print the received signal strength:
    long rssi = LWiFi.RSSI();
    Serial.print("signal strength (RSSI):");
    Serial.print(rssi);
    Serial.println(" dBm");
  }
}

//void connectToAP() {
//  connectToAP(WIFI_AP);
//}

void connectToAP(char *ssid)
{
  // Serial.println("Connecting to AP");
  // keep retrying until connected to AP
  // printWifiStatus();
  show_message = true;
  lcd.setCursor(0, 0);
  lcd.print("C. to " + String(ssid));
  // lcd.setCursor(0, 1);
  // lcd.print(WIFI_AP);

  if (LWiFi.connect(ssid, LWiFiLoginInfo(WIFI_AUTH, WIFI_PASSWORD)) > 0)
  {
    lcd.setCursor(0, 0);
    lcd.print("SSID:" + String(LWiFi.SSID()));
    lcd.setCursor(0, 1);
    IPAddress ip = LWiFi.localIP();
    lcd.print("IP:" + String(ip[0]) + "." + String(ip[1]) + "." + String(ip[2]) + "." + String(ip[3]));
    server.begin();
    offline_mode = false;
  } else {
    if(ssid == WIFI_AP2) {
      connectToAP(WIFI_AP2);
    } else {
      lcd.setCursor(0, 0);
      lcd.print("cnt. failed");
      lcd.setCursor(0, 1);
      lcd.print("Offline mode on");
      offline_mode = true;
    }
  }
  show_message = false;
  delay(2000);
}


class WifiConnectionThread : public Thread
{

  void run()
  {
    // only reconnect when connection is not avaiable
    if(LWiFi.status() != 2){
      connectToAP(WIFI_AP);
    }
  }
};
