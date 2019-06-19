/*
  This test code is write for Arduino AVR Series(UNO, Leonardo, Mega)
  If you want to use with LinkIt ONE, please connect the module to D0/1 and modify:

  // #include <SoftwareSerial.h>
  // SoftwareSerial s_serial(2, 3);      // TX, RX

  #define sensor Serial1
*/

//#include <SoftwareSerial.h>
//SoftwareSerial s_serial(2, 3);      // TX, RX

#include <LWiFi.h>
#include <LWiFiClient.h>
#include <LBattery.h>
#include <LDateTime.h>

#define WIFI_AP "YOU GOT ME MAD NOW"
#define WIFI_PASSWORD ""
#define SITE_URL ""
#define DELAY_INTERVAL 1000
#define TOKEN ""
#define WIFI_AUTH LWIFI_WPA // choose from LWIFI_OPEN, LWIFI_WPA, or LWIFI_WEP.
#define sensor Serial1
LWiFiClient c;
datetimeInfo t;
const unsigned char cmd_get_sensor[] =
    {
        0xff, 0x01, 0x86, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x79};

unsigned char dataRevice[9];
unsigned int temperature;
unsigned long CO2PPM;

void setup()
{
  sensor.begin(9600);
  Serial.begin(115200);
  LWiFi.begin();
  connectToAP();
}

void loop()
{
  if (dataRecieve())
  {
    request();
  }

  delay(DELAY_INTERVAL);
}

void connectToAP()
{
  Serial.println("Connecting to AP");
  // keep retrying until connected to AP
  printWifiStatus();
  while (0 == LWiFi.connect(WIFI_AP, LWiFiLoginInfo(WIFI_AUTH, WIFI_PASSWORD)))
  {
    Serial.println("re Connecting to AP");
    delay(1000);
  }
  Serial.println("Connected to AP");
  printWifiStatus();
}

bool dataRecieve(void)
{
  byte data[9];
  int i = 0;

  //transmit command data
  for (i = 0; i < sizeof(cmd_get_sensor); i++)
  {
    sensor.write(cmd_get_sensor[i]);
  }
  delay(10);
  //begin reveiceing data
  if (sensor.available())
  {
    while (sensor.available())
    {
      for (int i = 0; i < 9; i++)
      {
        data[i] = sensor.read();
      }
    }
  }

  if ((i != 9) || (1 + (0xFF ^ (byte)(data[1] + data[2] + data[3] + data[4] + data[5] + data[6] + data[7]))) != data[8])
  {
    return false;
  }

  CO2PPM = (int)data[2] * 256 + (int)data[3];
  temperature = (int)data[4] - 42;

  return true;
}

void request()
{
  // keep retrying until connected to website
  while (0 == c.connect(SITE_URL, 4000))
  {
    Serial.println("Re-Connecting to WebSite");
    Serial.print("LWiFi.status()");
    Serial.print(LWiFi.status());
    Serial.println();

    if (LWiFi.status() != 2)
    {
      connectToAP();
    }

    delay(1000);
  }

  String arg = "?token=" + String(TOKEN);
  arg += "&c=" + String(CO2PPM);
  arg += "&t=" + String(temperature);
  arg += "&battery=" + String(LBattery.level());
  LDateTime.getTime(&t);
  // arg += "&time=" + String(&t);

  Serial.println("requesting with: " + arg);
  // send HTTP request, ends with 2 CR/LF
  //  Serial.println("sending HTTP GET request");
  c.println("GET /zawarudo" + arg + " HTTP/1.1");
  c.println("Host: " SITE_URL);
  c.println("Connection: close");
  c.println();

  c.stop();

  // waiting for server response
  //  Serial.println("waiting HTTP response:");
  //  int waitTimes = 0;
  //  while (!c.available())
  //  {
  //    delay(100);
  //    waitTimes++;
  //
  //    if ( waitTimes == 50 ) {
  //      return;
  //    }
  //  }
  // Make sure we are connected, and dump the response content to Serial
  //  while (c)
  //  {
  //    int v = c.read();
  //    if (v != -1)
  //    {
  //      Serial.print((char)v);
  //    }
  //    else
  //    {
  //      Serial.println("no more content, disconnect");
  //      c.stop();
  //      while (1)
  //      {
  //        delay(1);
  //      }
  //    }
  //  }
}

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

// void printBatteryStatus()
// {
//   Serial.print("Battery level is ");
//   Serial.println(LBattery.level());
//   Serial.print("Charging: ");
//   Serial.println(LBattery.isCharging() ? "yes" : "no");
// }
