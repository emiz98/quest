import cv2
from deepface import DeepFace
import imutils
from alive_progress import alive_bar
import matplotlib.pyplot as plt


# Load the video clip
video_path = "./videos/test/test4.mp4"
cap = cv2.VideoCapture(video_path)

# Get the total number of frames
frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

# Dictionary to store emotion counts
emotion_counts = {
    "angry": 1,
    "fear": 1,
    "neutral": 1,
    "sad": 1,
    "disgust": 1,
    "happy": 1,
    "surprise": 1,
}

# Initialize the pie chart
fig = plt.figure()
ax = fig.add_subplot(111)
plt.axis("equal")
emotions_labels = list(emotion_counts.keys())
emotion_values = list(emotion_counts.values())
patches, _ = ax.pie(emotion_values, labels=emotions_labels, startangle=90)
plt.title("Emotion Distribution")

with alive_bar(frame_count, title="Processing Frames", bar="blocks") as bar:
    while True:
        # Read a frame from the video
        ret, frame = cap.read()
        if not ret:
            break

        # Detect emotions in the frame
        result = DeepFace.analyze(
            frame,
            actions=["emotion"],
            enforce_detection=False,
            detector_backend="opencv",
            silent=True,
        )
        emotions = result[0]["emotion"]

        # Find the most dominant emotion
        emotion_label = max(emotions, key=emotions.get)
        emotion_counts[emotion_label] += 1

        # Update the pie chart
        emotion_values = list(emotion_counts.values())
        ax.clear()
        patches, _ = ax.pie(emotion_values, labels=emotions_labels, startangle=90)
        plt.title("Emotion Distribution")

        # Draw the updated pie chart
        plt.draw()
        plt.pause(0.001)

        # Display the resulting frame
        # cv2.imshow("Emotion Detection", imutils.resize(frame, width=600))

        # Update the progress bar
        bar()

        # Check for 'q' key press to exit
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    # Release the video capture and close all windows
    cap.release()
    cv2.destroyAllWindows()

# # Display the final emotion counts
# print("Final Emotion Counts:")
# for emotion, count in emotion_counts.items():
#     print(f"{emotion}: {count}")

# Final Emotion Counts:
# angry: 254
# fear: 883
# neutral: 1616
# sad: 541
# disgust: 7
# happy: 387
# surprise: 81
