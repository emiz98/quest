import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_quest/animations.dart';
import 'package:flutter_quest/palette.dart';
import 'package:flutter_quest/screens/Home.dart';
import 'package:flutter_quest/widgets/InputField.dart';
import 'package:lottie/lottie.dart';

class Start extends StatefulWidget {
  const Start({Key? key}) : super(key: key);

  @override
  State<Start> createState() => _StartState();
}

class _StartState extends State<Start> {
  final formKey = GlobalKey<FormState>();
  final ipController = TextEditingController();
  final portController = TextEditingController();
  late Timer _timer;
  bool _isPlaying = false;

  @override
  void initState() {
    super.initState();
    _playAnimation();
    ipController.text = "192.168.1.32";
    portController.text = "8000";
  }

  @override
  void dispose() {
    _timer.cancel();
    ipController.dispose();
    portController.dispose();
    super.dispose();
  }

  void _playAnimation() {
    setState(() {
      _isPlaying = true;
    });

    _timer = Timer(const Duration(seconds: 4), () {
      setState(() {
        _isPlaying = false;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: primary,
      resizeToAvoidBottomInset: false,
      body: Center(
        child: Container(
          padding: const EdgeInsets.all(app_padding),
          width: double.maxFinite,
          height: double.maxFinite,
          child: _isPlaying
              ? Lottie.asset(
                  starter,
                  repeat: false,
                  animate: _isPlaying,
                )
              : Form(
                  autovalidateMode: AutovalidateMode.onUserInteraction,
                  key: formKey,
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 250),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        InputField(
                            text: "Ip address",
                            icon: Icons.computer,
                            controller: ipController,
                            error: 'Please enter an ip'),
                        const SizedBox(
                          height: 10,
                        ),
                        InputField(
                            text: "Port",
                            icon: Icons.electrical_services_rounded,
                            controller: portController,
                            error: 'Please enter port'),
                        const SizedBox(
                          height: 20,
                        ),
                        ElevatedButton(
                            style: ElevatedButton.styleFrom(
                                shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(8)),
                                minimumSize: const Size.fromHeight(50),
                                textStyle: const TextStyle(
                                    fontSize: 20, fontWeight: FontWeight.w500),
                                primary: secondary),
                            child: const Text("Continue"),
                            onPressed: () {
                              final isValidForm =
                                  formKey.currentState!.validate();
                              if (isValidForm) {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                      builder: (context) => Home(
                                            socketIp:
                                                "http://${ipController.text}:${portController.text}",
                                          )),
                                );
                              }
                            })
                      ],
                    ),
                  ),
                ),
        ),
      ),
    );
  }
}
