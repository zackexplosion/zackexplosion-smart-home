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

void connectToAP()
{
  // Serial.println("Connecting to AP");
  // keep retrying until connected to AP
  // printWifiStatus();
  show_message = true;
  lcd.setCursor(0, 0);
  lcd.print("Connecting to AP");
  // lcd.setCursor(0, 1);
  // lcd.print(WIFI_AP);

  if (LWiFi.connect(WIFI_AP, LWiFiLoginInfo(WIFI_AUTH, WIFI_PASSWORD)) > 0)
  {
    lcd.setCursor(0, 0);
    lcd.print("SSID:" + String(LWiFi.SSID()));
    lcd.setCursor(0, 1);
    IPAddress ip = LWiFi.localIP();
    lcd.print("IP:" + String(ip[0]) + "." + String(ip[1]) + "." + String(ip[2]) + "." + String(ip[3]));
    // printWifiStatus();
    // for (int i = 0; i <= 24; i++)
    // {
    //   lcd.scrollDisplayLeft();
    //   delay(100);
    // }
    server.begin();
  } else {
    lcd.setCursor(0, 0);
    lcd.print("cnt. failed");
    lcd.setCursor(0, 1);
    lcd.print("Offline mode on");
    offline_mode = true;
  }
  show_message = false;
  delay(2000);
}
class WifiConnectionThread : public Thread
{

  void run()
  {
    offline_mode = true;
    if(LWiFi.status() != 2){
      connectToAP();
    }
  }
};
