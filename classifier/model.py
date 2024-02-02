from typing import Any
import json
import torch
import torchvision
import torchvision.transforms as transforms

# Other models at https://pytorch.org/vision/stable/models.html
MODEL_NAME = "mobilenet_v2"
DEVICE_ID = "cpu"

class Model():
    def __init__(self):
        # Get model from TorchVision, move to device, set eval
        self.model = getattr(torchvision.models, MODEL_NAME)(pretrained=True)
        self.model.to(DEVICE_ID)
        self.model.eval()

        # Create transform to handle image transformation
        self.transform = transforms.Compose([
                                transforms.Resize((224, 224)),
                                transforms.Grayscale(num_output_channels=3),
                                transforms.ToTensor(),
                                transforms.Normalize(mean=[0.485, 0.456, 0.406],
                                 std=[0.229, 0.224, 0.225])
                            ])
        
        # Imagenet labels for tensor -> label
        self.labels = json.load(open("imagenet_labels.json", 'r'))
        
    def __call__(self, image, **kwargs):
        # Resize image using transform, move to device
        image = self.transform(image)
        image = image.to(DEVICE_ID).float()
        image = torch.unsqueeze(image, 0)

        # Infer model and get preds
        outputs = self.model(image)
        _, preds = outputs.max(1)

        print(self.labels[preds.item()])

        return self.labels[preds.item()]

 