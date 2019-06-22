#include <LWiFi.h>
#include <LWiFiClient.h>
#include <LWiFiServer.h>

LWiFiClient wifiClient;
LWiFiServer server(80);

void printWifiStatus()
{
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

void connectToAP()
{
  // Serial.println("Connecting to AP");
  // keep retrying until connected to AP
  // printWifiStatus();
  lcd.setCursor(0, 1);
  lcd.print("Connecting to AP");

  if (0 != LWiFi.connect(WIFI_AP, LWiFiLoginInfo(WIFI_AUTH, WIFI_PASSWORD)))
  {
    lcd.setCursor(0, 1);
    lcd.print("connected to:" + String(LWiFi.SSID()));
    printWifiStatus();
    for (int i = 0; i <= 16; i++)
    {
      lcd.scrollDisplayLeft();
      delay(100);
    }
  }
}

void sendSensorData()
{
  Serial.println("sendSensorData");
  // keep retrying until connected to website
  if (wifiClient.connect(TRACKER_URL, TRACKER_PORT) == 0)
  {
    // lcd.setCursor(0, 1);
    // lcd.print("Re-Connecting to Tracker");
  }
  else
  {
    wifiClient.print("GET /zawarudo");
    wifiClient.print("?token=");
    wifiClient.print(TOKEN);
    wifiClient.print("&c=");
    wifiClient.print(CO2PPM);
    wifiClient.print("&t=");
    wifiClient.print(temperature);
    wifiClient.println(" HTTP/1.1");
    wifiClient.println("Host: " TRACKER_URL);
    wifiClient.println("Connection: close");
    wifiClient.println();
  }

  wifiClient.stop();
}

String buildResponse()
{
  String data = "{\"co2ppm\":";
  data += CO2PPM;
  data += ",\"temperature\":";
  data += temperature;
  data += "}";
  return data;
}

class HTTPServerThread : public Thread
{
  void run()
  {
    // Serial.println("logger run");
    if (LWiFi.status() != 2)
    {
      connectToAP();
    }

    LWiFiClient client = server.available();
    if (client && client.connected() && client.available() && CO2PPM != 0)
    {
      // // send a standard http response header
      client.println("HTTP/1.1 200 OK");
      client.println("Content-Type: application/vnd.api+json");
      // // client.println("Connection: close");  // the connection will be closed after completion of the response
      client.println("Connection: Keep-Alive");
      client.println("Cache-Control: max-age=0, private, must-revalidate");
      String res = buildResponse();
      client.print("Content-Length: ");
      client.println(res.length());
      client.println();
      client.println(res);
      client.println();



      Serial.println("new client " + res);
      delay(100);
      client.stop();
    }
    runned();
  }
};

void setupWIFI()
{
  connectToAP();
  server.begin();
}