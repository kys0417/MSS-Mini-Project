import time
import RPi.GPIO as GPIO
import Adafruit_MCP3008

trig = 20
echo = 16
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup(trig, GPIO.OUT)
GPIO.setup(echo, GPIO.IN)
GPIO.output(trig, False)

mcp = Adafruit_MCP3008.MCP3008(clk=11, cs=8, miso=9, mosi=10)

# 초음파 센서를 대한 전역 변수 선언 및 초기화
def measureDistance():
        global trig, echo
        GPIO.output(trig, True)  # 신호 1 발생
        time.sleep(0.00001)  # 짧은시간후 0으로 떨어뜨려 falling edge를 만들기 위함
        GPIO.output(trig, False)  # 신호 0 발생(falling 에지)

        while(GPIO.input(echo) == 0):
                pass
        pulse_start = time.time()  # 신호 1. 초음파 발생이 시작되었음을 알림
        while(GPIO.input(echo) == 1):
                pass
        pulse_end = time.time()  # 신호 0. 초음파 수신 완료를 알림

        pulse_duration = pulse_end - pulse_start
        return 340*100/2*pulse_duration

# LED 점등을 위한 전역 변수 선언 및 초기화
redled = 13  # 핀 번호 GPIO13 의미
yellowled = 6  # GPIO6
greenled = 5  # GPIO5
GPIO.setup(redled, GPIO.OUT)  # GPIO 13번 핀을 출력 선으로 지정.
GPIO.setup(yellowled, GPIO.OUT) # GPIO 6번 핀을 출력 선으로 지정.
GPIO.setup(greenled, GPIO.OUT) # GPIO 5번 핀을 출력 선으로 지정.

def controlRedLED(onOff):  # 빨간색 led 번호의 핀에 onOff(0/1) 값 출력하는 함수
        GPIO.output(redled, onOff)
def controlYellowLED(onOff): # 노란색 led 번호의 핀에 onOff(0/1) 값 출력하는 함수
        GPIO.output(yellowled, onOff)
def controlGreenLED(onOff): # 초록색 led 번호의 핀에 onOff(0/1) 값 출력하는 함수
        GPIO.output(greenled, onOff)






