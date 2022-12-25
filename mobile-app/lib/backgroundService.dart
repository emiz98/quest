import 'dart:async';
import 'dart:developer';
import 'dart:ui';
import 'package:flutter/material.dart';

import 'package:flutter_background_service_android/flutter_background_service_android.dart';

import 'package:flutter_background_service/flutter_background_service.dart'
    show
        AndroidConfiguration,
        FlutterBackgroundService,
        IosConfiguration,
        ServiceInstance;
import 'package:flutter_tts/flutter_tts.dart';
// ignore_for_file: depend_on_referenced_packages
import 'package:speech_to_text/speech_recognition_result.dart';
import 'package:speech_to_text/speech_to_text.dart';

final service = FlutterBackgroundService();

Future initializeService() async {
  _initSpeech();
  await service.configure(
    androidConfiguration: AndroidConfiguration(
      // this will executed when app is in foreground or background in separated isolate
      onStart: onStart,
      // auto start service
      autoStart: true,
      isForegroundMode: false,
    ),
    iosConfiguration: IosConfiguration(
      // auto start service
      autoStart: true,
      // this will executed when app is in foreground in separated isolate
      onForeground: onStart,
      // you have to enable background fetch capability on xcode project
      onBackground: onIosBackground,
    ),
  );
  await service.startService();
}

bool onIosBackground(ServiceInstance service) {
  WidgetsFlutterBinding.ensureInitialized();
  return true;
}

void onStart(ServiceInstance service) async {
  DartPluginRegistrant.ensureInitialized();
  _initSpeech();
  if (service is AndroidServiceInstance) {
    service.on('setAsForeground').listen((event) {
      service.setAsForegroundService();
    });

    service.on('setAsBackground').listen((event) async {
      service.setAsBackgroundService();
    });
  }

  service.on('stopService').listen((event) {
    service.stopSelf();
  });

  // bring to foreground
  Timer.periodic(const Duration(seconds: 1), (timer) async {
    if (service is AndroidServiceInstance) {
      service.setForegroundNotificationInfo(
        title: "My App Service",
        content: "Updated at ${DateTime.now()}",
      );
    }

    if (_speechEnabled) {
      _startListening();
    }

    // test using external plugin
    service.invoke(
      'update',
      {
        "current_date": DateTime.now().toIso8601String(),
        "last_message": _lastWords,
      },
    );
  });
}

final SpeechToText _speechToText = SpeechToText();
bool _speechEnabled = false;
String _lastWords = "Say something";
void _initSpeech() async {
  _speechEnabled = await _speechToText.initialize();
}

void _startListening() async {
  await _speechToText.listen(
    onResult: _onSpeechResult,
  );
}

void _stopListening() async {
  await _speechToText.stop();
}

Future<void> _onSpeechResult(SpeechRecognitionResult result) async {
  var flutterTts = FlutterTts();
  await flutterTts.setVoice({"name": "Karen", "locale": "en-AU"});

  _lastWords = (result.recognizedWords.toString().toLowerCase());

  if (_lastWords.contains("quest")) {
    flutterTts.speak("hi how you doing?");
  } else if (_lastWords.contains('stop')) {
    _stopListening();
    flutterTts.speak("Stopped");
    await _speechToText.stop();
  }
}
