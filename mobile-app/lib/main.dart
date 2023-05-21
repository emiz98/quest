import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_quest/palette.dart';
import 'package:flutter_quest/screens/Start.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      systemNavigationBarColor: Colors.transparent));
  SystemChrome.setEnabledSystemUIMode(SystemUiMode.leanBack);
  SystemChrome.setPreferredOrientations([
    DeviceOrientation.landscapeLeft,
    DeviceOrientation.landscapeRight,
  ]).then((value) => runApp(const MyApp()));
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: "Quest",
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
          primaryColor: primary,
          errorColor: white,
          visualDensity: VisualDensity.standard),
      home: const Start(),
    );
  }
}
