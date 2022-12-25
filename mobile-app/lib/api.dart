import 'package:dio/dio.dart';

class APIService {
  late Dio _dio;

  APIService() {
    BaseOptions options = BaseOptions(
        receiveTimeout: 100000,
        connectTimeout: 100000,
        headers: {
          'Content-type': 'application/json;charset=UTF-8',
          'Accept': 'application/json;charset=UTF-8',
        },
        baseUrl: 'http://192.168.1.32:5005/');
    _dio = Dio(options);
  }

  // Future getChats(email) async {
  //   try {
  //     final response = await _dio.get('chats/$email',
  //         options: Options(headers: {
  //           'Content-type': 'application/json;charset=UTF-8',
  //           'Accept': 'application/json;charset=UTF-8',
  //         }));
  //     return response.data;
  //   } on DioError catch (e) {
  //     throw e.error;
  //   }
  // }

  Future talk(String sender, String message) async {
    try {
      final response = await _dio.post(
        'webhooks/rest/webhook',
        data: {"sender": sender, "message": message},
      );
      return response.data;
    } on DioError catch (e) {
      throw e.error;
    }
  }
}
