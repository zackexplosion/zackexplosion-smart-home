class RGBThread: public Thread
{
 int i = 0;
 int currentColor = 0;
 bool increase = true;
 unsigned char color = REG_RED;
 void run(){
   lcd.setPWM(color, i);
   if(increase) {
     i++;
   } else{
     i--;
   }

   if(i == 254) {
     increase = false;
   } else if(i == 0){
    Serial.println(currentColor);
     increase = true;
     currentColor++;

     if(currentColor >= 3){
       currentColor = 0;
     }

     switch(currentColor){
       case 0:
         color = REG_RED;
         break;
       case 1:
         color = REG_GREEN;
         break;
       case 2:
         color = REG_BLUE;
         break;
     }

   }
   runned();
 }
};
