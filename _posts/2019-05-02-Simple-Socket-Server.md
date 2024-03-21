---
layout: post
title: 简单的 Socket 服务
categories:
  - 工程
tags:
  - Socket
  - Server
date: 2019-05-02 15:26:28
giscus_comments: true
---

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2019-05-02-Simple-Socket-Server/simple_socket_server.png" title="simple_socket_server" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

Socket 编程是一种将网络的两个节点连接起来的方式,根据已经比较成熟的socket库我们已经简单地编写服务器客户点通信的模型

<!-- more -->

简单的服务逻辑

## 服务器端

```python
# -*- coding: utf-8 -*-
# @Time     : 2019/05/01 20:30
# @Author   : Bill H
# @Email    : lcurious@163.com
# @File     : server.py
# @License  : Apache-2.0
# Copyright (C) Bill H All rights reserved
from threading import Thread
from socketserver import StreamRequestHandler, TCPServer
from datetime import datetime

import numpy as np
import logging
import cv2


def recv_all(conn, count):
    """
    util function for collecting data from connection
    :param conn:
    :param count:
    :return:
    """
    buf = b''  # only byte data allowed
    while count:
        new_buf = conn.recv(count)
        if not new_buf:
            return None
        buf += new_buf
        count -= len(new_buf)
    return buf


class FairHandler(StreamRequestHandler):
    """
    Simple class handle some customize function
    """
    encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 90]

    def handle(self):
        logger.info("Got connection from: {addr}".format(addr=self.client_address))
        self.custom_service()

    def custom_service(self):
        """
        A case for showing handle image from remote service
        :return:
        """
        while True:
            length = recv_all(self.connection, 16)
            logger.info("Receiving data length: {len}".format(len=length))
            if length is None:
                logger.info("Client {addr} closed a connection".format(addr=self.client_address))
                break
            recv_string_data = recv_all(self.connection, int(length))
            # some data transfer function
            img = self.decode_data(recv_string_data)
            reply_img = self.process_data(img)

            # reply
            send_string_data = self.encode_data(reply_img)
            logger.debug("Sending data length:{len_str}".format(len_str=length))
            self.connection.send(str(len(send_string_data)).ljust(16).encode())
            self.connection.send(send_string_data)

    def decode_data(self, string_data):
        """
        decode data with agreed rule
        :param data:
        :return:
        """
        data = np.fromstring(string_data, dtype=np.uint8)
        decode_img = cv2.imdecode(data, 1)
        return decode_img

    def encode_data(self, img_data):
        """
        encode data with agreed rule
        :param data:
        :return:
        """
        result, encode_img = cv2.imencode('.jpg', img_data, self.encode_param)
        string_data = np.asarray(encode_img).tostring()
        return string_data

    def process_data(self, img):
        """
        simple process for add some difference in reply
        :param img:
        :return:
        """
        # do nothing
        # blur_img = cv2.blur(img, (5, 5))
        return img


if __name__ == '__main__':
    TCP_IP = '127.0.0.1'
    TCP_PORT = 58888
    NUM_WORKERS = 2

    log_path = "logs/{date}-server.log".format(date=datetime.now().strftime("%m-%d-%Y"))
    # Create a custom logger
    logger = logging.getLogger(__name__)

    # Create handlers
    c_handler = logging.StreamHandler()
    f_handler = logging.FileHandler(log_path)
    c_handler.setLevel(logging.DEBUG)
    f_handler.setLevel(logging.INFO)

    # Create formatters and add it to handlers
    c_format = logging.Formatter('%(name)s - %(levelname)s - %(message)s')
    f_format = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    c_handler.setFormatter(c_format)
    f_handler.setFormatter(f_format)

    # Add handlers to the logger
    logger.addHandler(c_handler)
    logger.addHandler(f_handler)
    logger.setLevel(logging.DEBUG)

    serv = TCPServer((TCP_IP, TCP_PORT), FairHandler)
    for n in range(NUM_WORKERS):
        t = Thread(target=serv.serve_forever)
        t.daemon = True
        t.start()
    serv.serve_forever()
```

## 客户端

```python
# -*- coding: utf-8 -*-
# @Time     : 2019/05/02 01:01
# @Author   : Bill H
# @Email    : lcurious@163.com
# @File     : client.py
# @License  : Apache-2.0
# Copyright (C) Bill H All rights reserved
import socket

import cv2
import numpy as np


encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 90]


def recv_all(conn, count):
    """
    util function for collecting data from connection
    :param conn:
    :param count:
    :return:
    """
    buf = b''  # only byte data allowed
    while count:
        new_buf = conn.recv(count)
        if not new_buf:
            return None
        buf += new_buf
        count -= len(new_buf)
    return buf


def sending(tcp_addr):
    cap = cv2.VideoCapture(0)
    sock = socket.socket()
    sock.connect(tcp_addr)
    cv2.namedWindow("CLIENT", cv2.WINDOW_KEEPRATIO)
    while True:
        ret, frame = cap.read()
        result, img_encode = cv2.imencode('.jpg', frame, encode_param)
        data = np.asarray(img_encode)
        string_data = data.tostring()
        # sending data
        sock.send(str(len(string_data)).ljust(16).encode())
        sock.send(string_data)

        # receiving data
        length = recv_all(sock, 16)
        string_data = recv_all(sock, int(length))
        data = np.fromstring(string_data, dtype=np.uint8)

        dec_img = cv2.imdecode(data, 1)
        cv2.imshow("CLIENT", dec_img)
        key = cv2.waitKey(20)
        if key == 27:
            break
    sock.close()


if __name__ == '__main__':
    TCP_IP = '127.0.0.1'
    TCP_PORT = 58888
    sending((TCP_IP, TCP_PORT))
```
