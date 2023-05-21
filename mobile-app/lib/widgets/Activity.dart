import 'dart:developer';
import 'dart:typed_data';

import 'package:carousel_slider/carousel_slider.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_quest/api.dart';
import 'package:flutter_quest/palette.dart';

class Activity extends StatefulWidget {
  const Activity({Key? key}) : super(key: key);

  @override
  State<Activity> createState() => _ActivityState();
}

class _ActivityState extends State<Activity> {
  final apiService = APIService();
  List activities = [];

  @override
  void initState() {
    super.initState();
    fetchActivities();
  }

  fetchActivities() async {
    var res = await apiService.getActivities();
    setState(() {
      activities = res['data'];
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: primary,
      body: activities.isNotEmpty
          ? GestureDetector(
              onTap: () =>
                  SystemChrome.setEnabledSystemUIMode(SystemUiMode.leanBack),
              child: CarouselSlider.builder(
                  options: CarouselOptions(
                    height: double.infinity,
                    autoPlay: true,
                    viewportFraction: 1.2,
                    autoPlayCurve: Curves.easeInOut,
                    autoPlayInterval: const Duration(seconds: 3),
                    autoPlayAnimationDuration:
                        const Duration(milliseconds: 800),
                    enlargeCenterPage: true,
                    enlargeFactor: 1,
                  ),
                  itemCount: activities.length ~/ 2,
                  itemBuilder: (BuildContext context, int itemIndex,
                          int pageViewIndex) =>
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          CarousalItem(itemIndex * 2, true),
                          CarousalItem(itemIndex * 2 + 1, false),
                        ],
                      )))
          // return Container(
          //     width: MediaQuery.of(context).size.width,
          //     margin: EdgeInsets.symmetric(horizontal: 5.0),
          //     decoration: BoxDecoration(color: Colors.amber),
          //     child: Text(
          //       'text $i',
          //       style: TextStyle(fontSize: 16.0),
          //     ));

          //   child: SingleChildScrollView(
          //     scrollDirection: Axis.horizontal,
          //     child: Padding(
          //       padding: const EdgeInsets.symmetric(vertical: 70),
          //       child: Row(
          //           children: List.generate(activities.length, (index) {
          //         return Padding(
          //           padding: const EdgeInsets.symmetric(horizontal: 120),
          //           child: Column(
          //             children: [
          //               Container(
          //                   width: 200,
          //                   height: 200,
          //                   decoration: BoxDecoration(
          //                       border: Border.all(color: white, width: 2),
          //                       borderRadius: BorderRadius.circular(100)),
          //                   child: ClipRRect(
          //                     borderRadius: BorderRadius.circular(100),
          //                     child: Image.memory(
          //                       Uint8List.fromList(activities[index]['image']
          //                               ['data']
          //                           .cast<int>()),
          //                       fit: BoxFit.cover,
          //                     ),
          //                   )),
          //               const SizedBox(
          //                 height: 5,
          //               ),
          //               Container(
          //                 width: 150,
          //                 padding: const EdgeInsets.symmetric(
          //                     horizontal: 20, vertical: 10),
          //                 decoration: BoxDecoration(
          //                     color: white,
          //                     borderRadius: BorderRadius.circular(10)),
          //                 child: Text(
          //                   activities[index]['title'],
          //                   textAlign: TextAlign.center,
          //                   style:
          //                       const TextStyle(color: black, fontSize: 20),
          //                 ),
          //               )
          //             ],
          //           ),
          //         );
          //       })),
          //     ),
          //   ),
          // )
          : Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: const [
                  CircularProgressIndicator(
                    strokeWidth: 5.0,
                    color: white,
                  ),
                  SizedBox(
                    height: 15,
                  ),
                  Text(
                    "Please wait...",
                    style: TextStyle(color: white, fontSize: 18),
                  )
                ],
              ),
            ),
    );
  }

  Padding CarousalItem(int itemIndex, bool isLeftEye) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 120, vertical: 80),
      child: SizedBox(
        width: 250,
        height: 250,
        child: Stack(
          children: [
            Positioned(
              top: 30,
              left: isLeftEye ? 50 : 0,
              child: Container(
                  width: 200,
                  height: 200,
                  decoration: BoxDecoration(
                      border: Border.all(color: white, width: 2),
                      borderRadius: BorderRadius.circular(100)),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(100),
                    child: Image.memory(
                      Uint8List.fromList(
                          activities[itemIndex]['image']['data'].cast<int>()),
                      fit: BoxFit.cover,
                    ),
                  )),
            ),
            Positioned(
              top: 0,
              left: isLeftEye ? 0 : 100,
              child: RotationTransition(
                turns: isLeftEye
                    ? const AlwaysStoppedAnimation(-30 / 360)
                    : const AlwaysStoppedAnimation(30 / 360),
                child: Container(
                  width: 150,
                  padding:
                      const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                  decoration: BoxDecoration(
                      color: white, borderRadius: BorderRadius.circular(10)),
                  child: Text(
                    activities[itemIndex]['title'],
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                        color: black,
                        fontSize: 20,
                        fontWeight: FontWeight.w600),
                  ),
                ),
              ),
            )
          ],
        ),
      ),
    );
  }
}
