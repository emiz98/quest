import 'package:flutter/material.dart';
import 'package:flutter_quest/palette.dart';

class Temp extends StatefulWidget {
  const Temp({Key? key}) : super(key: key);

  @override
  State<Temp> createState() => _TempState();
}

class _TempState extends State<Temp> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: primary,
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 130, vertical: 100),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Container(
              width: 150,
              height: 150,
              decoration: BoxDecoration(
                  color: white, borderRadius: BorderRadius.circular(25)),
            ),
            Container(
              width: 150,
              height: 150,
              decoration: BoxDecoration(
                  color: white, borderRadius: BorderRadius.circular(25)),
            )
          ],
        ),
      ),
    );
  }
}
