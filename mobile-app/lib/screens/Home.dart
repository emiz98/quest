import 'package:flutter/material.dart';
import 'package:flutter_quest/palette.dart';
import 'package:flutter_quest/widgets/SpeakBtn.dart';
import 'package:lottie/lottie.dart';
import 'package:socket_io_client/socket_io_client.dart';
import 'package:flutter_tts/flutter_tts.dart';

class Home extends StatefulWidget {
  const Home({Key? key}) : super(key: key);

  @override
  State<Home> createState() => _HomeState();
}

class _HomeState extends State<Home> {
  bool _isAnimate = false;
  late Socket socket;

  @override
  void initState() {
    super.initState();
    socketInit();
  }

  void socketInit() {
    try {
      socket = io('http://192.168.1.32:8000', <String, dynamic>{
        'transports': ['websocket'],
        'autoConnect': false,
      });

      socket.connect(); // Connect to websocket

      // Handle socket events
      socket.on('connect', (_) => print('connect: ${socket.id}'));
      socket.on('message', (data) => handleMessage(data));
      socket.on('disconnect', (_) => print('disconnect'));
    } catch (e) {
      print(e.toString());
    }
  }

  sendMessage(String message) {
    socket.emit(
      "message",
      {
        "id": socket.id,
        "message": message, // Message to be sent
        "timestamp": DateTime.now().millisecondsSinceEpoch,
      },
    );
  }

  // Listen to all message events from connected users
  void handleMessage(data) {
    print(data);
    _onSpeechResult(data['msg']);
  }

  animateTrue() {
    setState(() => _isAnimate = !_isAnimate);
  }

  Future<void> _onSpeechResult(response) async {
    var flutterTts = FlutterTts();

    await flutterTts.setLanguage("en-AU");
    await flutterTts.setSpeechRate(0.35);
    await flutterTts.setPitch(1);

    animateTrue();
    flutterTts.speak(response);
    Future.delayed(const Duration(milliseconds: 1500), () => animateTrue());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: primary,
      body: Padding(
        padding: const EdgeInsets.all(app_padding),
        child: Stack(
          children: [
            Align(
                alignment: Alignment.topRight,
                child: InkWell(
                  onTap: () {},
                  child: Ink(
                    width: 50,
                    height: 50,
                    decoration: const BoxDecoration(
                        borderRadius: BorderRadius.all(Radius.circular(10)),
                        color: secondary),
                    child: const Icon(
                      Icons.menu,
                      color: white,
                    ),
                  ),
                )),
            Center(
                child: _isAnimate
                    ? Lottie.asset(
                        'assets/lotties/happy.json',
                        animate: _isAnimate,
                      )
                    : Lottie.asset(
                        'assets/lotties/love.json',
                        animate: _isAnimate,
                      )),
            Align(
                alignment: Alignment.bottomRight,
                child: SpeakBtn(
                  animateTrueFunc: animateTrue,
                )),
          ],
        ),
      ),
    );
  }
}
