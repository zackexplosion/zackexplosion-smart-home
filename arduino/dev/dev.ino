/*
  Using Thread to control RGB LED and Counter
 */

// include and define lcd first
#include "rgb_lcd.h"
rgb_lcd lcd;


#include <Wire.h>
#include <Thread.h>
#include <ThreadController.h>

// inlcude local class and function
#include "RGBThread.h"
#include "CounterThread.h"
#include "CO2Sensor.h"


RGBThread rgbThread = RGBThread();
CounterThread counterThread = CounterThread();
CO2SensorThread co2SensorThread = CO2SensorThread();
// Instantiate a new ThreadController
ThreadController controller = ThreadController();
void setup() {
  sensor.begin(9600);
  Serial.begin(115200);
  lcd.begin(16, 2);
  lcd.print("Hello World!");

  rgbThread.setInterval(5);
  controller.add(&rgbThread);
  
//  controller.add(&counterThread);
//  counterThread.setInterval(1000);


  co2SensorThread.setInterval(1000);
  controller.add(&co2SensorThread);
  
  Serial.println("ready to start");
}

void loop() {
  controller.run();
}
