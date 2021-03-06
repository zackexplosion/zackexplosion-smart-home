/*
   Copyright (c) 2015, Majenko Technologies
   All rights reserved.

   Redistribution and use in source and binary forms, with or without modification,
   are permitted provided that the following conditions are met:

 * * Redistributions of source code must retain the above copyright notice, this
     list of conditions and the following disclaimer.

 * * Redistributions in binary form must reproduce the above copyright notice, this
     list of conditions and the following disclaimer in the documentation and/or
     other materials provided with the distribution.

 * * Neither the name of Majenko Technologies nor the names of its
     contributors may be used to endorse or promote products derived from
     this software without specific prior written permission.

   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
   ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
   WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
   DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
   ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
   (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
   LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
   ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
   (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
   SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

// Create your own settings.h or just uncomment.
// The file include those constant need to define.

// const char *ssid = "";
// const char *password = "";
// const char *TOKEN = "";

#include "settings.h"


#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>

#include <SimpleDHT.h>
#include <Thread.h>
#include <ThreadController.h>

int pinDHT11 = 2;
SimpleDHT11 dht11;
boolean DEBUG = true;
byte temperature = 0;
byte humidity = 0;
char _version[] = "1.0";
ESP8266WebServer server(80);

const int led = 13;

ThreadController controller = ThreadController();
void log(String l){
  if(DEBUG){
    Serial.println(l);
  }
}
void handleRoot() {

  if ( server.arg("token") != TOKEN){
    server.send(200, "application/json", "{\"error\": \"invalid token\"}");
    return;
  }

  String res = "{";
  res += "\"humidity\": " + String(humidity) + ",";
  res += "\"temperature\": " + String(temperature) + ",";
  res += "\"uptime\": " + String(millis()) + ",";
  res += "\"version\": " +String(_version);
  res += "}";
  server.send(200, "application/json", res);
}

class SensorDataThread : public Thread
{
  void run()
  {
    int err = SimpleDHTErrSuccess;
    if ((err = dht11.read(pinDHT11, &temperature, &humidity, NULL)) != SimpleDHTErrSuccess) {
//      Serial.print("Read D HT11 failed, err="); Serial.println(err);
      runned();
      return;
    }
  

    if (DEBUG) {
      Serial.print("Humidity = ");
      Serial.print((int)humidity);
      Serial.print("% , ");
      Serial.print("temperature = ");
      Serial.print((int)temperature);
      Serial.println("C ");
    }
    runned();
  }
};
SensorDataThread sensorThread = SensorDataThread();
void setup(void) {
  pinMode(led, OUTPUT);
  digitalWrite(led, LOW);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  // Wait for connection
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }

  if (DEBUG) {
    Serial.begin(115200);
    Serial.println("Connected to ");
    Serial.println(ssid);
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());
  }

  server.on("/", handleRoot);
  server.begin();
  log("HTTP server started");
  sensorThread.setInterval(1100);
  controller.add(&sensorThread);
}


void loop(void) {
  server.handleClient();
  controller.run();
}
