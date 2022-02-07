# publisher
import time
import paho.mqtt.client as mqtt
import circuit # 초음파 센서 입력 모듈 임포트
import myCamera 

flag = False # True이면 "action" 메시지를 수신하였음을 나타냄
YellowLedFlag = False # True 이면 노란색 led가 켜졌음을 나타냄
RedLedFlag = False # True 이면 빨간색 led가 켜졌음을 나타냄
GreenLedFlag = False # True 이면 초록색 led가 켜졌음을 나타냄

def on_connect(client, userdata, flag, rc): 
        client.subscribe("yellowLed", qos=0)
        client.subscribe("redLed", qos=0)
        client.subscribe("greenLed", qos=0)
        client.subscribe("facerecognition", qos = 0)
        
def on_message(client, userdata, msg):
        global flag, YellowLedFlag, RedLedFlag, GreenLedFlag
        command  = msg.payload.decode("utf-8")
        if command == "action" : 
                print("action msg received..")
                flag = True
        if(msg.topic == "yellowLed"): # 토픽 "yellowLed" 의 메세지를 받을때마다 yellow led 점등
                data = int(msg.payload);
                circuit.controlYellowLED(data) # data는 0또는 1의 정수
                if(data == 1): # 1이면 yellow led 가 점등된 것이므로 yellowledflag true
                        YellowLedFlag = True
                elif(data == 0): # 0이면 false
                        YellowLedFlag = False
        if(msg.topic == "redLed"): # 토픽 "redLed" 의 메세지를 받을때마다 red led 점등, green led off
                data = int(msg.payload);
                circuit.controlRedLED(data) # 이때 data = 1 red led 점등
                RedLedFlag = True # flag true
                circuit.controlGreenLED(0) # green led off
                GreenLedFlag = False 
        elif(msg.topic == "greenLed"):
                data = int(msg.payload); # 토픽 "greenLed" 의 메시지를 받을때마다  green led 점등, red led off
                circuit.controlRedLED(0) # red led off
                RedLedFlag = False
                circuit.controlGreenLED(data) # 이때 data = 1 green led 점등
                GreenLedFlag = True


broker_ip = "localhost" # 현재 이 컴퓨터를 브로커로 설정

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

client.connect(broker_ip, 1883)
client.loop_start()
while(True):
        if flag==True : # "action" 메시지 수신. 사진 촬영
                imageFileName = myCamera.takePicture() # 카메라 사진 촬영
                print(imageFileName)
                client.publish("image", imageFileName, qos=0)
                flag = False
        if YellowLedFlag == True and RedLedFlag == True: # 노란색 + 빨간색 = 택배 도난
                imageFileName = myCamera.takePicture() # 카메라 사진 촬영
                print(imageFileName)
                client.publish("image", imageFileName, qos=0)
                client.publish("DangerAlert", 1 , qos = 0) # 웹페이지에 택배 도난 알림을 보내기 위한 토픽 "DangerAlert"
                RedLedFlag = False
                YellowLedFlag = False
        elif YellowLedFlag == True and GreenLedFlag == True: # 노란색 + 초록색 = 택배가 존재하는 안전상태
                client.publish("SaveAlert", 1, qos=0) # 웹페이지에 안전 알림을 보내기 위한 토픽 "SaveAlert"
        getLight = circuit.mcp.read_adc(0) # 조도센서 값
        distance = circuit.measureDistance() # 초음파 센서 값
        client.publish("ultrasonic", distance, qos=0) # 초음파 센서 메시지 토픽 "ultrasonic"
        client.publish("Light", getLight, qos=0) # 조도센서 메시지 토픽 "Light"
        if(distance <= 20): # 초음파 센서 값이 20cm 이하이면
                client.publish("greenLed", 1, qos=0) # greenLed 토픽 publish
                client.publish("greenLedAlert",1,qos=0) # 웹페이지에 물체 감지 알림을 보내기 위한 토픽 "greenLedAlert"
        else: # 20cm 이상이면
                client.publish("redLed", 1, qos=0) # redLed 토픽 publish
                client.publish("redLedAlert",1,qos=0) # 웹페이지에 물체 미감지 알림을 보내기 위한 토픽 "redLedAlert"
        if(getLight > 500): # 조도센서 값이 500 이상이면
                client.publish("ShowLightAlert", 1 , qos=0) # 웹페이지에 현관 센서등 작동 알림을 보내기 위한 토픽 "ShowLightAlert"
        else:
                client.publish("EraseLightAlert",1,qos=0) # 웹페이지에 현관 센서등 미작동 알림을 보내기 위한 토픽 "EraseLightAlert"
        time.sleep(1)

client.loop_stop()
client.disconnect()
