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
    LWiFiClient client = server.available();
    if (client && client.connected() && client.available() && CO2PPM != 0)
    {
      log("new client ");

      // // send a standard http response header
      client.println("HTTP/1.1 200 OK");
      // client.println("Content-Type: text/html");
      client.println("Content-Type: application/json");
      // // client.println("Connection: close");  // the connection will be closed after completion of the response
      client.println("Connection: Keep-Alive");
      client.println("Cache-Control: max-age=0, private, must-revalidate");
      String res = buildResponse();
      // String res = String(CO2PPM) + "|" + String(temperature);
      client.print("Content-Length: ");
      client.println(res.length());
      client.println();
      client.println(res);
      client.println();

      log("new client ");

      delay(50);
      client.stop();
    }
    runned();
  }
};
