import torch
import torch.nn as nn
import torchvision.transforms as transforms
from PIL import Image
import io



classes = (
    "airplane", "bicycle", "book", "car", "chair",
    "clock", "house", "telephone", "tree", "umbrella"
)



class QuickDrawModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv1 = nn.Conv2d(1, 36, kernel_size=3, stride=1, padding=1)
        self.act1 = nn.ReLU()
        self.drop1 = nn.Dropout(0.3)

        self.conv2 = nn.Conv2d(36, 36, kernel_size=3, stride=1, padding=1)
        self.act2 = nn.ReLU()
        self.pool2 = nn.MaxPool2d(kernel_size=2)

        self.flat = nn.Flatten()
        self.fc3 = nn.Linear(36 * 14 * 14, 512)
        self.act3 = nn.ReLU()
        self.drop3 = nn.Dropout(0.5)

        self.fc4 = nn.Linear(512, 10)

    def forward(self, x):
        x = self.act1(self.conv1(x))
        x = self.drop1(x)
        x = self.act2(self.conv2(x))
        x = self.pool2(x)
        x = self.flat(x)
        x = self.act3(self.fc3(x))
        x = self.drop3(x)
        x = self.fc4(x)
        return x



def load_model(model_path="quickdraw_model.pth"):
    model = QuickDrawModel()
    model.load_state_dict(torch.load(model_path, map_location="cpu"))
    model.eval()
    return model


transform = transforms.Compose([
    transforms.Grayscale(num_output_channels=1),
    transforms.Resize((28, 28)),
    transforms.ToTensor()
])


def preprocess_png_bytes(png_bytes):
    img = Image.open(io.BytesIO(png_bytes)).convert("L")

    transform = transforms.Compose([
        transforms.Resize((28, 28)),
        transforms.ToTensor()
    ])

    x = transform(img)

    # INVERT because QuickDraw dataset is white-on-black
    x = 1.0 - x

    x = x.unsqueeze(0)

    # Debug save
    debug_img = transforms.ToPILImage()(x.squeeze(0))
    debug_img.save("/app/debug_downsampled.png")

    return x






# -----------------------------
# PNG prediction helper
# -----------------------------
def predict_png_bytes(png_bytes: bytes, model: QuickDrawModel):
    x = preprocess_png_bytes(png_bytes)

    with torch.no_grad():
        outputs = model(x)

    probs = torch.softmax(outputs, dim=1).squeeze(0)

    print("\n[DEBUG] Class probabilities:")
    for cls, p in zip(classes, probs.tolist()):
        print(f"  {cls:<10} {p:.4f}")

    idx = torch.argmax(probs).item()
    confidence = probs[idx].item()

    print(f"\n[DEBUG] Predicted: {classes[idx]} | Confidence: {confidence:.4f}\n")

    return classes[idx]




