#define sensor Serial1
const unsigned char cmd_get_sensor[] =
    {
        0xff, 0x01, 0x86, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x79};

unsigned char dataRevice[9];
unsigned int temperature;
unsigned long CO2PPM;

bool CO2SensorDataRecieve(void)
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

class CO2SensorThread: public Thread
{
  void run(){
    if( CO2SensorDataRecieve()) {
      lcd.setCursor(0,1);
      lcd.print(String(temperature) + char(223) + "c,CO2:" + String(CO2PPM) + "PPM");
    }
    runned();
  }
};
