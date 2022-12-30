import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:flutter_quest/api.dart';
import 'package:flutter_quest/palette.dart';
import 'package:speech_to_text/speech_recognition_result.dart';
import 'package:speech_to_text/speech_to_text.dart' as stt;
import 'package:flutter_tts/flutter_tts.dart';

class SpeakBtn extends StatefulWidget {
  final animateTrueFunc;
  final animateFalseFunc;
  const SpeakBtn(
      {Key? key, required this.animateTrueFunc, required this.animateFalseFunc})
      : super(key: key);

  @override
  State<SpeakBtn> createState() => _SpeakBtnState();
}

class _SpeakBtnState extends State<SpeakBtn> {
  final apiService = APIService();
  late stt.SpeechToText _speech;
  bool _isListening = false;
  String _text = "Say hey quest to speak with quest.";
  double _confidence = 1.0;
  int temp = 0;

  @override
  void initState() {
    super.initState();
    _speech = stt.SpeechToText();
  }

  talk(String message) async {
    var res = await apiService.talk("sender_test", message);
    return res[0]['text'];
    // return "Hello! how are you?";
  }

  Future<void> _onSpeechResult(SpeechRecognitionResult result) async {
    var flutterTts = FlutterTts();

    await flutterTts.setLanguage("en-US");
    await flutterTts.setSpeechRate(0.4);
    await flutterTts.setPitch(1.2);

    String _lastWords = (result.recognizedWords.toString().toLowerCase());

    if (_lastWords != "") {
      String botResponse = await talk(_lastWords);
      widget.animateTrueFunc();
      flutterTts.speak(botResponse);
      _speech.stop();
      flutterTts.setCompletionHandler(() {
        widget.animateFalseFunc();
      });
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
        setState(() => _isListening = true);
        _speech.listen(
            onResult: (result) => setState(() {
                  _text = result.recognizedWords;
                  _onSpeechResult(result);
                  if (result.hasConfidenceRating && result.confidence > 0) {
                    _confidence = result.confidence;
                  }
                }));
      }
    } else {
      setState(() => _isListening = false);
      _speech.stop();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          "$_text - ${(_confidence * 100).toStringAsFixed(0)}%",
          style: TextStyle(color: black.withOpacity(0.7), fontSize: 16),
        ),
        InkWell(
          onTap: _listen,
          customBorder: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(100),
          ),
          child: Ink(
            width: 140,
            decoration: BoxDecoration(
                border: Border.all(width: 4, color: secondary),
                borderRadius: BorderRadius.circular(100)),
            child: Padding(
              padding: const EdgeInsets.all(2),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Container(
                    padding: const EdgeInsets.all(5),
                    decoration: BoxDecoration(
                        color: secondary,
                        borderRadius: BorderRadius.circular(100)),
                    child: const Icon(
                      Icons.mic,
                      size: 25,
                      color: white,
                    ),
                  ),
                  const SizedBox(
                    width: 5,
                  ),
                  const Text(
                    "Say Quest",
                    style: TextStyle(
                        fontWeight: FontWeight.w600,
                        fontSize: 16,
                        color: black),
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}
