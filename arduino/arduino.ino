/*
  Using Thread to control RGB LED and Counter
 */
#include "config.h"
void log(String l){
  if(DEBUG){
    Serial.println(l);
  }
}

#include "rgb_lcd.h"
#include <Wire.h>
#include <Thread.h>
#include <ThreadController.h>
#include <LWiFi.h>
#include <LWiFiServer.h>

// global variables
rgb_lcd lcd;
unsigned int temperature;
unsigned long CO2PPM;
unsigned int temperature_offset = 2;
bool show_message = false;
bool offline_mode = false;
LWiFiServer server(80);

// local class and function
#include "WifiConnectionThread.h"
#include "RGBThread.h"
#include "CO2Sensor.h"
#include "HTTPServerThread.h"

RGBThread rgbThread = RGBThread();
CO2SensorThread co2SensorThread = CO2SensorThread();
HTTPServerThread httpServerThread = HTTPServerThread();
WifiConnectionThread wifiConnectionThread = WifiConnectionThread();

// Instantiate a new ThreadController
ThreadController controller = ThreadController();


void setup() {
  if(DEBUG){
    Serial.begin(12800);
  }

  LWiFi.begin();
  sensor.begin(9600);
  lcd.begin(16, 2);
  // boot screen
  // for(int i = 16; i >= 0; i--){
  //   lcd.clear();
  //   lcd.setCursor(i,0);
  //   lcd.print(BOOTMSG1);
  //   lcd.setCursor(i,1);
  //   lcd.print(BOOTMSG2);
  //   delay(100);
  // }
  connectToAP();
  wifiConnectionThread.setInterval(1000 * 60 * 5);
  httpServerThread.setInterval(10);
  co2SensorThread.setInterval(500);
  rgbThread.setInterval(7);

  controller.add(&httpServerThread);
  controller.add(&co2SensorThread);
  controller.add(&rgbThread);
  controller.add(&wifiConnectionThread);
}

void loop() {
  controller.run();
}
