from locust import HttpUser, task, between
import os
import json

class ClassifierInterfaceUser(HttpUser):
    jwt_token = ""

    def on_start(self):
        # Generate JWT token
        with self.client.get("/api/token/generate", catch_response=True) as response:
            if response.status_code == 200:
                data = json.loads(response.text)
                self.jwt_token = data['token']

    @task
    def post_infer(self):
        if self.jwt_token:
            headers = {'Authorization': f'Bearer {self.jwt_token}'}
            self.client.post("/api/classifier/infer", headers=headers, files={'image_file': ('filename', open('pixie.jpg', 'rb'), 'image/jpeg')})
