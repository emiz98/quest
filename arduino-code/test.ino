#include <Servo.h>

Servo head;
void setup() {
  head.attach(2);
  pinMode(4, OUTPUT);
  pinMode(5, OUTPUT);
  pinMode(6, OUTPUT);
  pinMode(7, OUTPUT);
}

void loop() {
  head.write(0);
  digitalWrite(4, 1);
  digitalWrite(6, 1);
  delay(1000);
  head.write(180);
  digitalWrite(4, 0);
  digitalWrite(6, 0);

  digitalWrite(5, 1);
  digitalWrite(7, 1);
  delay(1000);
  head.write(0);
  digitalWrite(5, 0);
  digitalWrite(7, 0);  
}

