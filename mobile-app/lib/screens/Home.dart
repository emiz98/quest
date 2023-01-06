import 'dart:convert';
import 'dart:developer';
import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:flutter_quest/api.dart';
import 'package:flutter_quest/palette.dart';
import 'package:flutter_quest/animations.dart';
import 'package:flutter_quest/widgets/SpeakBtn.dart';
import 'package:lottie/lottie.dart';
import 'package:socket_io_client/socket_io_client.dart';
import 'package:flutter_tts/flutter_tts.dart';

class Home extends StatefulWidget {
  const Home({Key? key}) : super(key: key);

  @override
  State<Home> createState() => _HomeState();
}

class _HomeState extends State<Home> with SingleTickerProviderStateMixin {
  final apiService = APIService();
  late AnimationController _controller;
  late Animation<double> _animation;

  Uint8List image = Uint8List(0);

  String animation = "idle";
  late Socket socket;

  @override
  void initState() {
    super.initState();
    socketInit();
    _controller = AnimationController(
      vsync: this,
      duration: Duration(milliseconds: 800),
    );
    _animation = TweenSequence(
      [
        TweenSequenceItem(
          tween: Tween(begin: 0.5, end: 1.0),
          weight: 50,
        ),
        TweenSequenceItem(
          tween: Tween(begin: 1.0, end: 0.5),
          weight: 50,
        ),
      ],
    ).animate(_controller);
    _controller.repeat();
  }

  @override
  void dispose() {
    super.dispose();
    _controller.dispose();
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
      socket.on('error', (err) => print(err));
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

  animateTrue(anim) {
    setState(() {
      animation = anim;
    });
  }

  animateFalse(anim) {
    setState(() {
      animation = anim;
      image = Uint8List(0);
    });
  }

  getCard(String id) async {
    var res = await apiService.getFlashCard(id);
    return res['data']['image']['data'];
  }

  Future<void> _onSpeechResult(response) async {
    var flutterTts = FlutterTts();

    await flutterTts.setLanguage("en-US");
    await flutterTts.setSpeechRate(0.38);
    await flutterTts.setPitch(1);

    flutterTts.speak(response['phrase']);
    if (response['animation'] == 'giveup') {
      final cardImage = await getCard(response['id']);
      setState(() {
        image = new Uint8List.fromList(cardImage.cast<int>());
        // image = new Uint8List.fromList(response['image']['data'].cast<int>());
      });
    }
    animateTrue(response['animation']);
    flutterTts.setCompletionHandler(() {
      animateFalse("idle");
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: primary,
      body: Stack(
        children: [
          Padding(
            padding: const EdgeInsets.all(app_padding),
            child: Align(
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
          ),
          if (animation == "idle")
            Center(
                child: Lottie.asset(
              idle,
            )),
          if (animation == "talk")
            Center(
                child: Lottie.asset(
              talk,
            )),
          if (animation == "happy")
            Center(
                child: Lottie.asset(
              happy,
            )),
          if (animation == "wrong")
            Center(
                child: Lottie.asset(
              wrong,
            )),
          if (animation == "cuddle")
            Center(
                child: Lottie.asset(
              cuddle,
            )),
          if (animation == "giveup")
            Center(
                child: Stack(
              children: [
                // Lottie.asset(
                //   giveup,
                // ),
                Positioned(
                  top: 100,
                  left: 160,
                  child: ScaleTransition(
                      scale:
                          _animation.drive(CurveTween(curve: Curves.easeInOut)),
                      child: Row(children: [
                        SizedBox(
                          height: 200,
                          width: 200,
                          child: Image.memory(image),
                        ),
                        SizedBox(
                          width: 130,
                        ),
                        SizedBox(
                            height: 200, width: 200, child: Image.memory(image))
                      ])
                      // Image.memory(image)
                      ),
                ),
              ],
            )),
          // Align(
          //     alignment: Alignment.bottomRight,
          //     child: SpeakBtn(
          //         animateTrueFunc: animateTrue, animateFalseFunc: animateTrue)),
        ],
      ),
    );
  }
}
