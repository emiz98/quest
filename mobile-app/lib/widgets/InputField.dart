import 'package:flutter/material.dart';
import 'package:flutter_quest/palette.dart';

class InputField extends StatelessWidget {
  final String text;
  final String error;
  final IconData icon;
  final TextEditingController controller;
  const InputField(
      {Key? key,
      required this.text,
      required this.icon,
      required this.controller,
      required this.error})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      style: const TextStyle(color: secondary, fontSize: 18),
      decoration: InputDecoration(
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(color: secondary, width: 2),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(color: secondary, width: 1),
        ),
        hintText: text,
        prefixIcon: Padding(
          padding: const EdgeInsets.symmetric(horizontal: app_padding),
          child: Icon(
            icon,
            color: secondary,
          ),
        ),
        contentPadding: const EdgeInsets.symmetric(vertical: app_padding),
      ),
      validator: (inputText) {
        if (inputText != null && inputText.length == 0) {
          return error;
        } else {
          return null;
        }
      },
    );
  }
}
