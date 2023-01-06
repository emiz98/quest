import 'package:dio/dio.dart';

class APIService {
  late Dio _dio;

  APIService() {
    BaseOptions options_rasa = BaseOptions(
        receiveTimeout: 100000,
        connectTimeout: 100000,
        headers: {
          'Content-type': 'application/json;charset=UTF-8',
          'Accept': 'application/json;charset=UTF-8',
        },
        baseUrl: 'http://192.168.1.32:5005/');

    BaseOptions options_data = BaseOptions(
        receiveTimeout: 100000,
        connectTimeout: 100000,
        headers: {
          'Content-type': 'application/json;charset=UTF-8',
          'Accept': 'application/json;charset=UTF-8',
        },
        baseUrl: 'https://quest-alpha.vercel.app/');

    _dio = Dio(options_rasa);
    _dio = Dio(options_data);
  }

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

  Future getFlashCard(String id) async {
    try {
      final response = await _dio.get('api/card/$id');
      return response.data;
    } on DioError catch (e) {
      throw e.error;
    }
  }
}
