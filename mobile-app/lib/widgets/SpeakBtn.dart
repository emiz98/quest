import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:flutter_quest/api.dart';
import 'package:flutter_quest/palette.dart';
import 'package:speech_to_text/speech_recognition_result.dart';
import 'package:speech_to_text/speech_to_text.dart' as stt;
import 'package:flutter_tts/flutter_tts.dart';

class SpeakBtn extends StatefulWidget {
  const SpeakBtn({Key? key}) : super(key: key);

  @override
  State<SpeakBtn> createState() => _SpeakBtnState();
}

class _SpeakBtnState extends State<SpeakBtn> {
  final apiService = APIService();
  late stt.SpeechToText _speech;
  bool _isListening = false;
  String _text = "";
  double _confidence = 1.0;

  @override
  void initState() {
    super.initState();
    _speech = stt.SpeechToText();
  }

  talk(String message) async {
    var res = await apiService.talk("sender_test", message);
    return res[0]['text'];
  }

  Future<void> _onSpeechResult(String result) async {
    Future.delayed(const Duration(seconds: 1));
    var flutterTts = FlutterTts();

    await flutterTts.setLanguage("en-US");
    await flutterTts.setSpeechRate(0.4);
    await flutterTts.setPitch(1.2);

    String _lastWords = (result.toString().toLowerCase());

    if (_lastWords.length > 2) {
      String botResponse = await talk(_lastWords);
      flutterTts.speak(botResponse);
      _speech.stop();
    }

    // if (_lastWords.contains("quest")) {
    //   widget.animateTrueFunc();
    //   flutterTts.speak("hi... my name is quest");
    //   _speech.stop();
    // } else if (_lastWords.contains('stop')) {
    //   _speech.stop();
    // }
  }

  void _listen() async {
    if (!_isListening) {
      bool available = await _speech.initialize(
        onStatus: ((status) => print(status)),
        onError: (errorNotification) => print(errorNotification),
      );
      if (available) {
        _speech.listen(
          onResult: (result) => {
            setState(() {
              _isListening = true;
              _text = result.recognizedWords;
              if (result.hasConfidenceRating && result.confidence > 0) {
                _confidence = result.confidence;
              }
              _onSpeechResult(_text);
            })
          },
          listenMode: stt.ListenMode.confirmation,
          partialResults: false,
        );
      }
    } else {
      setState(() => _isListening = false);
      _speech.stop();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(app_padding),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          InkWell(
            onTap: _listen,
            child: Ink(
              width: 50,
              height: 50,
              decoration: const BoxDecoration(
                  borderRadius: BorderRadius.all(Radius.circular(10)),
                  color: secondary),
              child: const Icon(
                Icons.mic,
                color: white,
              ),
            ),
          ),
          const SizedBox(
            width: app_padding,
          ),
          Text(
            "$_text - ${(_confidence * 100).toStringAsFixed(0)}%",
            style: TextStyle(color: black.withOpacity(0.7), fontSize: 16),
          ),
        ],
      ),
    );
  }
}
