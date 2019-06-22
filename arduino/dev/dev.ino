/*
  Using Thread to control RGB LED and Counter
 */

#include "config.h"
#include "rgb_lcd.h"
#include <Wire.h>
#include <Thread.h>
#include <ThreadController.h>

// global variables
rgb_lcd lcd;
unsigned int temperature;
unsigned long CO2PPM;
unsigned int temperature_offset = 2;

// local class and function
#include "RGBThread.h"
#include "CO2Sensor.h"
#include "HTTPServerThread.h"

RGBThread rgbThread = RGBThread();
//CounterThread counterThread = CounterThread();
CO2SensorThread co2SensorThread = CO2SensorThread();
HTTPServerThread httpServerThread = HTTPServerThread();
// Instantiate a new ThreadController
ThreadController controller = ThreadController();

void setup() {
  sensor.begin(9600);
  Serial.begin(12800);
  LWiFi.begin();
  lcd.begin(16, 2);
  setupWIFI();

  // boot screen
  for(int i = 16; i >= 0; i--){
    lcd.clear();
    lcd.setCursor(i,0);
    lcd.print(BOOTMSG1);
    lcd.setCursor(i,1);
    lcd.print(BOOTMSG2);
    delay(100);
  }

  rgbThread.setInterval(7);
  controller.add(&rgbThread);
//  controller.add(&counterThread);
//  counterThread.setInterval(1000);

  co2SensorThread.setInterval(500);
  controller.add(&co2SensorThread);

  httpServerThread.setInterval(100);
  controller.add(&httpServerThread);
//  Serial.println("ready to start");
}

void loop() {
  controller.run();
}
