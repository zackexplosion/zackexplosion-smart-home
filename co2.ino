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

#define WIFI_AP ""
#define WIFI_PASSWORD ""
#define SITE_URL ""
#define DELAY_INTERVAL 1000
#define TOKEN ""
#define WIFI_AUTH LWIFI_WPA  // choose from LWIFI_OPEN, LWIFI_WPA, or LWIFI_WEP.
#define sensor Serial1
LWiFiClient c;

const unsigned char cmd_get_sensor[] =
{
    0xff, 0x01, 0x86, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x79
};

unsigned char dataRevice[9];
int temperature;
int CO2PPM;

void setupWIFI(){
  LWiFi.begin();
  // keep retrying until connected to AP
  Serial.println("Connecting to AP");
  while (0 == LWiFi.connect(WIFI_AP, LWiFiLoginInfo(WIFI_AUTH, WIFI_PASSWORD)))
  {
    delay(1000);
  }
}

bool dataRecieve(void)
{
    byte data[9];
    int i = 0;

    //transmit command data
    for(i=0; i<sizeof(cmd_get_sensor); i++)
    {
        sensor.write(cmd_get_sensor[i]);
    }
    delay(10);
    //begin reveiceing data
    if(sensor.available())
    {
        while(sensor.available())
        {
            for(int i=0;i<9; i++)
            {
                data[i] = sensor.read();
            }
        }
    }

//    for(int j=0; j<9; j++)
//    {
//        Serial.print(data[j]);
//        Serial.print(" ");
//    }
//    Serial.println("");

    if((i != 9) || (1 + (0xFF ^ (byte)(data[1] + data[2] + data[3] + data[4] + data[5] + data[6] + data[7]))) != data[8])
    {
        return false;
    }

    CO2PPM = (int)data[2] * 256 + (int)data[3];
//    Serial.print("TEMP: ");
//    Serial.print(data[4]);
//    Serial.println();
    temperature = (int)data[4] - 42;
//    temperature = (int)data[4] - 48;

    return true;
}
String arg = "?a=1&b=2";
void request(){
  // keep retrying until connected to website
  Serial.println("Connecting to WebSite");
  while (0 == c.connect(SITE_URL, 4000))
  {
    Serial.println("Re-Connecting to WebSite");
    delay(1000);
  }

  // inject arguments
  arg = "?c=" + String(CO2PPM) + "&t=" + String(temperature) + "&token=" + TOKEN;

  // send HTTP request, ends with 2 CR/LF
  Serial.println("send HTTP GET request");
  c.println("GET /zawarudo" + arg + " HTTP/1.1");
  c.println("Host: " SITE_URL );
  c.println("Connection: close");
  c.println();

  // waiting for server response
  Serial.println("waiting HTTP response:");
  int waitTimes = 0;
  while (!c.available())
  {
    delay(100);
    waitTimes++;

    if ( waitTimes == 50 ) {
      return;
    }
  }
  // Make sure we are connected, and dump the response content to Serial
  while (c)
  {
    int v = c.read();
    if (v != -1)
    {
      Serial.print((char)v);
    }
    else
    {
      Serial.println("no more content, disconnect");
      c.stop();
      while (1)
      {
        delay(1);
      }
    }
  }
  Serial.println();
}

void setup()
{
    sensor.begin(9600);
    Serial.begin(115200);
    Serial.println("get a 'g', begin to read from sensor!");
    Serial.println("********************************************************");
    Serial.println();
    setupWIFI();
}

void loop()
{
    if(dataRecieve())
    {
        Serial.print("Temperature: ");
        Serial.print(temperature);
        Serial.print("  CO2: ");
        Serial.print(CO2PPM);
        Serial.println("");
        request();
    }
    delay(DELAY_INTERVAL);
}