var port = 9001 // mosquitto의 디폴트 웹 포트
var client = null; // null이면 연결되지 않았음

function startConnect() { // 접속을 시도하는 함수
	clientID = "clientID-" + parseInt(Math.random() * 100); // 랜덤한 사용자 ID 생성

	// 사용자가 입력한 브로커의 IP 주소와 포트 번호 알아내기
	broker = document.getElementById("broker").value; // 브로커의 IP 주소

	// id가 message인 DIV 객체에 브로커의 IP와 포트 번호 출력
	// MQTT 메시지 전송 기능을 모두 가징 Paho client 객체 생성
	client = new Paho.MQTT.Client(broker, Number(port), clientID);

	// client 객체에 콜백 함수 등록
	client.onConnectionLost = onConnectionLost; // 접속이 끊어졌을 때 실행되는 함수 등록
	client.onMessageArrived = onMessageArrived; // 메시지가 도착하였을 때 실행되는 함수 등록
	
	// 브로커에 접속. 매개변수는 객체 {onSuccess : onConnect}로서, 객체의 프로퍼틴느 onSuccess이고 그 값이 onConnect.
	// 접속에 성공하면 onConnect 함수를 실행하라는 지시
	client.connect({
		onSuccess: onConnect,
	});
}

var isConnected = false;

function onConnect() { // 브로커로의 접속이 성공할 때 호출되는 함수
	isConnected = true;
	document.getElementById("messages").innerHTML += '<span>Connected</span><br/>';
}

var topicSave;
function subscribe(topic) {
	if(client == null) return;
	if(isConnected != true) {
		topicSave = topic;
		window.setTimeout("subscribe(topicSave)", 500);
		return
	}
	client.subscribe(topic); // 브로커에 subscribe
}
function publish(topic, msg) {
	if(client == null) return; // 연결되지 않았음
	client.send(topic, msg, 0, false);
}

function unsubscribe(topic) {
	if(client == null || isConnected != true) return;
	client.unsubscribe(topic, null); // 브로커에 subscribe
}

// 접속이 끊어졌을 때 호출되는 함수
function onConnectionLost(responseObject) { // 매개변수인 responseObject는 응답 패킷의 정보를 담은 개체
	document.getElementById("messages").innerHTML += '<span>오류 : 접속 끊어짐</span><br/>';
	if (responseObject.errorCode !== 0) {
		document.getElementById("messages").innerHTML += '<span>오류 : ' + + responseObject.errorMessage + '</span><br/>';
	}
}

// 메시지가 도착할 때 호출되는 함수
function onMessageArrived(msg) { // 매개변수 msg는 도착한 MQTT 메시지를 담고 있는 객체
	console.log("onMessageArrived: " + msg.payloadString + " topic: " + msg.destinationName);

	if(msg.destinationName == "ultrasonic") // ultrasonic 토픽을 받으면
		addDistanceData(parseFloat(msg.payloadString)); // 차트에 초음파 센서 값을 그린다
	else if(msg.destinationName == "Light") // Light 토픽을 받으면
		addLightData(msg.payloadString); // 차트에 조도센서 값을 그린다
	else if(msg.destinationName == "redLedAlert") // redLedAlert 토픽을 받으면
		document.getElementById("ledMsg").innerHTML = '20CM 이내에 물체가 없습니다!!'; // 물체가 미감지 되었다는 알림 표시
	else if(msg.destinationName == "greenLedAlert") // greenLedAlert 토픽을 받으면
		document.getElementById("ledMsg").innerHTML = '20CM 이내에 물체가 감지되었습니다!!'; // 물체가 감지 되었다는 알림 표시
	else if(msg.destinationName == "image") // image 토픽을 받으면
		drawImage(msg.payloadString); // 메시지에 담긴 파일 이름으로 drawImage() 호출. drawImage()는 웹 페이지에 있음
	else if(msg.destinationName == "DangerAlert") // DangerAlert 토픽을 받으면
		document.getElementById("cameraMsg").innerHTML = '택배가 도난되었습니다!! 실시간 사진을 확인해주세요!!'; // 택배가 도난되었다는 알림 표시
	else if(msg.destinationName == "SaveAlert") // SaveAlert 토픽을 받으면
		document.getElementById("cameraMsg").innerHTML = '택배가 아직 있습니다. 빠른 시간안에 찾아가주세요!!'; // 안전하다는 알림 표시
	else if(msg.destinationName == "ShowLightAlert") // ShowLightAlert 토픽을 받으면
		document.getElementById("lightMsg").innerHTML = '현관 센서등이 켜졌습니다.'; // 현관 센서등이 켜졌다는 알림 표시
	else if(msg.destinationName == "EraseLightAlert") // EraseLightAlert 토픽을 받으면
		document.getElementById("lightMsg").innerHTML = '현관 센서등이 꺼져있습니다.'; // 현관 센서등이 꺼졌다는 알림 표시
}
// disconnection 버튼이 선택되었을 때 호출되는 함수
function startDisconnect() {
	client.disconnect(); // 브로커에 접속 해제
	document.getElementById("messages").innerHTML += '<span>Disconnected</span><br/>';
}


