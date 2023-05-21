# Rasa Chatbot

![alt text](https://miro.medium.com/max/1000/1*eTCvmCllb1xW9vyvZkCX2Q.png)

<br/>

### Run App Locally

<br/>

##### Installation steps

```bash
conda create -n install_demo python=3.8
conda activate install_demo
python -m pip uninstall pip
python -m ensurepip
python -m pip install -U pip
pip install rasa
rasa -h
rasa init
rasa train
rasa shell
```

##### Running steps

```bash
rasa run --enable-api
```

### Sample request & response

```bash
{
    "sender": "test_user",
    "message": "who r u"
}
```

```bash
[
    {
    "recipient_id": "test_user",
    "text": "I'm both the Rasa bot and the Rasa mascot. My name is Sara!"
    }
]
```

### Rest endpoint

http://192.168.1.32:5005/webhooks/rest/webhook

### Documentations

https://rasa.com/docs/rasa/chitchat-faqs/
https://www.kaggle.com/datasets/rtatman/corpus-of-bilingual-childrens-speech

###### 💗 (4-FYP) Human Robotics Interaction
