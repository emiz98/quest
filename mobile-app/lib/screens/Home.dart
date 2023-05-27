import 'dart:async';
import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:flutter_quest/api.dart';
import 'package:flutter_quest/palette.dart';
import 'package:flutter_quest/animations.dart';
import 'package:flutter_quest/widgets/Activity.dart';
import 'package:lottie/lottie.dart';
import 'package:socket_io_client/socket_io_client.dart';
import 'package:flutter_tts/flutter_tts.dart';

class Home extends StatefulWidget {
  final String socketIp;
  final String nodeIp;
  const Home({Key? key, required this.socketIp, required this.nodeIp})
      : super(key: key);

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

  late Timer sleepTimer;
  int elapsedTime = 0;

  List activities = [];

  @override
  void initState() {
    super.initState();
    startTimer();
    socketInit();
    fetchActivities();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
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

  fetchActivities() async {
    var res = await apiService.getActivities();
    setState(() {
      activities = res['data'];
    });
  }

  void startTimer() {
    sleepTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      setState(() {
        if (elapsedTime > 1200) {
          elapsedTime = 0;
          animation = "sleep";
        } else {
          elapsedTime++;
        }
      });
    });
  }

  void socketInit() {
    try {
      socket = io(widget.socketIp, <String, dynamic>{
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
    setState(() {
      elapsedTime = 0;
    });
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

  cuddleAnim() async {
    var res = await apiService.cuddleAnimation(widget.nodeIp);
    return res;
  }

  Future<void> _onSpeechResult(response) async {
    var flutterTts = FlutterTts();

    await flutterTts.setLanguage("en-US");
    await flutterTts.setSpeechRate(0.4);
    await flutterTts.setPitch(1.2);

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
      if (response['animation'] != 'activity') animateFalse("idle");
    });
  }

  Future<void> triggerCuddleAnim() async {
    setState(() {
      elapsedTime = 0;
    });

    var flutterTts = FlutterTts();

    await flutterTts.setLanguage("en-US");
    await flutterTts.setSpeechRate(0.6);
    await flutterTts.setPitch(1.2);

    animateTrue("cuddle");
    cuddleAnim();
    flutterTts.speak("hehe! hehe!");
    await Future.delayed(const Duration(seconds: 2));
    animateTrue("idle");
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: primary,
      body: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          // Positioned(
          //   top: 10,
          //   left: 10,
          //   child: InkWell(
          //     onTap: () =>
          //         SystemChrome.setEnabledSystemUIMode(SystemUiMode.leanBack),
          //     child: Ink(
          //       width: 50,
          //       height: 50,
          //       decoration: const BoxDecoration(
          //           borderRadius: BorderRadius.all(Radius.circular(10)),
          //           color: tertiary),
          //       child: const Icon(
          //         Icons.fullscreen,
          //         color: white,
          //       ),
          //     ),
          //   ),
          // ),
          // if (animation == "activity") Activity(activities: activities),
          if (animation == "idle")
            GestureDetector(
              onTap: () => triggerCuddleAnim(),
              child: Lottie.asset(
                idle,
              ),
            ),
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
          if (animation == "sleep")
            GestureDetector(
              onTap: () => triggerCuddleAnim(),
              child: Center(
                  child: Lottie.asset(
                sleep,
              )),
            ),
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
            ScaleTransition(
                scale: _animation.drive(CurveTween(curve: Curves.easeInOut)),
                child: Padding(
                  padding: const EdgeInsets.only(top: 90),
                  child: Row(children: [
                    SizedBox(
                      height: 200,
                      width: 200,
                      child: Image.memory(image),
                    ),
                    const SizedBox(
                      width: 130,
                    ),
                    SizedBox(
                        height: 200, width: 200, child: Image.memory(image))
                  ]),
                )),
          // Align(alignment: Alignment.topLeft, child: SpeakBtn()),
        ],
      ),
    );
  }
}
