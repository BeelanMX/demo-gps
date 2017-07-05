#include <lmic.h>
#include <hal/hal.h>
#include <SPI.h>
#include <math.h>
#include <SoftwareSerial.h>

#define _USE_GPS_
//#define _USE_PM25_

#ifdef _USE_GPS_
#include <TinyGPS++.h>
SoftwareSerial ss(5, 4);
TinyGPSPlus gps;
double gps_lat = 0;
double gps_lng = 0;
double gps_alt = 0;
bool gpsEncoded = false;
#endif


#define debugSerial Serial

unsigned long previousMillis = 0;

static const PROGMEM u1_t NWKSKEY[16] ={0x22,0x83,0x78,0x32,0x71,0x29,0x83,0x78,0x12,0x38,0x91,0x23,0x78,0x13,0x90,0x18};
static const u1_t PROGMEM APPSKEY[16] ={0x12,0x38,0x21,0x38,0x92,0x83,0x71,0x38,0xAA,0xAB,0xBF,0xFF,0xFF,0xBF,0xBF,0xBF};
static const u4_t DEVADDR =0x21212121;

void os_getArtEui (u1_t* buf) { }
void os_getDevEui (u1_t* buf) { }
void os_getDevKey (u1_t* buf) { }

// We will be using Cayenne Payload Format
// For one sensor,
// the general format is channel | type | payload
// payload size depends on type
// here we are using temperature, GPS and customised PM25,
// temperature - 2, GPS - 9, PM25 - 2

static osjob_t sendjob;

// Schedule TX every this many seconds (might become longer due to duty
// cycle limitations).
const unsigned TX_INTERVAL = 20;

// Pin mapping for RFM9X
const lmic_pinmap lmic_pins = {
    .nss = 10,
    .rxtx = LMIC_UNUSED_PIN,
    .rst = 9,
    .dio = {2, 6, 7},
};

void debug_char(u1_t b) {
  debugSerial.write(b);
}

void debug_hex (u1_t b) {
  debug_char("0123456789ABCDEF"[b >> 4]);
  debug_char("0123456789ABCDEF"[b & 0xF]);
}

void debug_buf (const u1_t* buf, u2_t len) {
  while (len--) {
    debug_hex(*buf++);
    debug_char(' ');
  }
  debug_char('\r');
  debug_char('\n');
}

void onEvent (ev_t ev) {
  switch (ev) {
    case EV_TXCOMPLETE:

      // indicating radio TX complete
      digitalWrite(A1, LOW);

      debugSerial.println(F("[LMIC] Radio TX complete (included RX windows)"));
      if (LMIC.txrxFlags & TXRX_ACK)
        debugSerial.println(F("[LMIC] Received ack"));
      if (LMIC.dataLen) {
        debugSerial.print(F("[LMIC] Received "));
        debugSerial.print(LMIC.dataLen);
        debugSerial.println(F(" bytes of payload"));
        debug_buf(LMIC.frame + LMIC.dataBeg, LMIC.dataLen);
      }
      break;

    default:
      debugSerial.println(F("[LMIC] Unknown event"));
      break;
  }
}

void do_send(osjob_t* j, uint8_t *mydata, uint16_t len) {
  // Check if there is not a current TX/RX job running
  if (LMIC.opmode & OP_TXRXPEND) {
    debugSerial.println(F("[LMIC] OP_TXRXPEND, not sending"));
  } else {
    // Prepare upstream data transmission at the next possible time.
    LMIC_setTxData2(1, mydata, len, 0);
  }
}



void setup() {
  debugSerial.begin(115200);
  debugSerial.println(F("[INFO] LoRa Demo Node 1 Demonstration"));

  //initialise LED as output and at low state
  pinMode(A1, OUTPUT);
  pinMode(A0, OUTPUT);
  digitalWrite(A1, LOW);
  digitalWrite(A0, HIGH);
  delay(250);
  digitalWrite(A0, LOW);
  // start GPS object
  ss.begin(9600);


  os_init();
  LMIC_reset();

  uint8_t appskey[sizeof(APPSKEY)];
  uint8_t nwkskey[sizeof(NWKSKEY)];
  memcpy_P(appskey, APPSKEY, sizeof(APPSKEY));
  memcpy_P(nwkskey, NWKSKEY, sizeof(NWKSKEY));

  LMIC_setSession (0x1, DEVADDR, nwkskey, appskey);
  //LMIC_selectSubBand(3);
  for (int channel=0; channel<72; ++channel) {
      LMIC_disableChannel(channel);
    }

      LMIC_enableChannel(48);
      LMIC_enableChannel(49);
      LMIC_enableChannel(50);
      LMIC_enableChannel(51);
      LMIC_enableChannel(52);
      LMIC_enableChannel(53);
      LMIC_enableChannel(54);
      LMIC_enableChannel(55);
      LMIC_enableChannel(70);

  LMIC_setLinkCheckMode(0);
  LMIC_setAdrMode(false);
  LMIC_setDrTxpow(DR_SF7, 14); //SF7

  previousMillis = millis();

}

void loop() {

  GPS_loop();


  if (millis() > previousMillis + TX_INTERVAL * 1000) { //Start Job at every TX_INTERVAL*1000

    getInfoAndSend();
    previousMillis = millis();
  }

  os_runloop_once();
}

void getInfoAndSend() {

  uint8_t len = 0;
  //len += 4; // temperature
  if (gpsEncoded) len += 11; // GPS

  uint8_t mydata[len];
  uint8_t cnt = 0;
  uint8_t ch = 0;

  // Temperature
  /*debugSerial.println(F("[INFO] Collecting temperature info"));
  float temp = readTemperature();
  debugSerial.print(F("[INFO] Temperature:")); debugSerial.println(temp);
  int val = round(temp * 10);
  mydata[cnt++] = ch;
  mydata[cnt++] = 0x67;
  mydata[cnt++] = highByte(val);
  mydata[cnt++] = lowByte(val);*/

  // GPS
  if (gpsEncoded) {
    digitalWrite(A0, LOW);
    debugSerial.println(F("[INFO] Collecting GPS info"));
    debugSerial.print(F("[INFO] Lat:")); debugSerial.println(String(gps_lat, 6));
    debugSerial.print(F("[INFO] Lng:")); debugSerial.println(String(gps_lng, 6));
    debugSerial.print(F("[INFO] Alt:")); debugSerial.println(gps_alt);
    long lat = round(gps_lat * 10000);
    long lng = round(gps_lng * -10000);
    long alt = round(gps_alt * 100);
    ch = ch + 1;
    mydata[cnt++] = ch;
    mydata[cnt++] = 0x88;
    mydata[cnt++] = lat >> 16;
    mydata[cnt++] = lat >> 8;
    mydata[cnt++] = lat;
    mydata[cnt++] = lng >> 16;
    mydata[cnt++] = lng >> 8;
    mydata[cnt++] = lng;
    mydata[cnt++] = alt >> 16;
    mydata[cnt++] = alt >> 8;
    mydata[cnt++] = alt;
  }
  else{
    digitalWrite(A0, HIGH);
  }


  if (cnt == len) {
    debugSerial.println(F("[LMIC] Start Radio TX"));

    // indicating start radio TX
    digitalWrite(A1, HIGH);

    do_send(&sendjob, mydata, sizeof(mydata));
  }
  else
    debugSerial.println(F("[ERROR] Data stack incorrect"));
}

float readTemperature() {

  int a = analogRead(A0);
  float R = 1023.0 / ((float)a) - 1.0;
  R = 100000.0 * R;

  float temperature = 1.0 / (log(R / 100000.0) / 4275 + 1 / 298.15) - 273.15; //convert to temperature via datasheet ;

  return temperature;

}


void GPS_loop() {
  if (!ss.isListening()) {
    ss.listen();
  }
  while (ss.available() > 0) {
    if (gps.encode(ss.read())) {

      if (gps.location.isValid() && gps.altitude.isValid()) {

        // indicating GPS is successfully obtained
        gpsEncoded = true;

        // update the locations
        gps_lat = gps.location.lat();
        gps_lng = gps.location.lng();
        gps_alt = gps.altitude.meters();
      }
    }
  }
}