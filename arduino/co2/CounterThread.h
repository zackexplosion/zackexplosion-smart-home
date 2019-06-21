class CounterThread: public Thread
{
  int blinkCount = 0;
  void run(){
    lcd.setCursor(0,1);
    lcd.print(blinkCount);
    blinkCount++;
    runned();
  }
};
