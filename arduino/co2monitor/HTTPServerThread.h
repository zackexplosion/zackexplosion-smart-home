// String buildResponse(int resTime = 0)
// {
//   String data = "{\"co2ppm\":";
//   data += CO2PPM;
//   data += ",\"temperature\":";
//   data += temperature;
//   data += ",\"uptime\":";
//   data += millis();
//   data += "}";
//   return data;
// }

void response(LWiFiClient client, int enterTime = 0) {
  // send a standard http response header
  client.println("HTTP/1.1 200 OK");
  // client.println("Content-Type: text/html");
  client.println("Content-Type: application/json");
  client.println("Connection: close");  // the connection will be closed after completion of the response
  // client.println("Connection: Keep-Alive");
  // client.println("Cache-Control: max-age=0, private, must-revalidate");
  // String res = buildResponse();
  client.print("Content-Length: ");

  String data = "{\"co2ppm\":";
  data += CO2PPM;
  data += ",\"temperature\":";
  data += temperature;
  data += ",\"uptime\":";
  data += millis();
  data += ",\"resTime\":";
  data += millis() - enterTime;
  data += "}";

  client.println(data.length());
  client.println();
  client.println(data);
  client.println();
}

class HTTPServerThread : public Thread
{
  void run()
  {
//    skip if offline mode on
//    if(offline_mode) {
//      runned();
//      return;
//    }

    LWiFiClient client = server.available();
    if (client && CO2PPM != 0)
    {
      // an http request ends with a blank line
      boolean currentLineIsBlank = true;
      int enterTime = millis();
      while (client.connected()) {
        // timeout
        if (millis() - enterTime > 1000) break;
        if (client.available()) {

          // we basically ignores client request, but wait for HTTP request end
          int c = client.read();

          if (c == '\n' && currentLineIsBlank)
          {
            response(client, enterTime);
            break;
          }
          if (c == '\n')
          {
            // you're starting a new line
            currentLineIsBlank = true;
          }
          else if (c != '\r')
          {
            // you've gotten a character on the current line
            currentLineIsBlank = false;
          }
        }
      }

      delay(100);
      // log("RAM:" + availableMemory());
      client.stop();
    }
    runned();
  }
};
