<template>
  <v-btn style="position: relative;" variant="plain"> open
    <input class="input" type="file" @change="handleFileInput" accept="video" />
  </v-btn>
  <v-btn  v-if="showPlayer" style="position: relative;" variant="plain">Subtitle
    <input class="input" type="file" @change="handleSubtitles" accept=".vtt,.srt" />
  </v-btn>
  <div class="relative overflow-hidden h-full">
    <!-- File Input for Video Selection -->

    <!-- Video.js Player Container -->
    <video
      ref="videoPlayer"
      id="videoPlayer"
      class="vjs-matrix video-js "
      controls
      preload="auto"
    ></video>
  </div>
</template>
<script setup>
import videojs from "video.js";
import "video.js/dist/video-js.css";
const videoPlayer = ref(null); // Reference to the <video> element
let player = null; // Video.js player instance
// Handle file input change
const showPlayer = ref(false)
const handleFileInput = (event) => {
  const file = event.target.files[0];
  if (file) {
    const fileURL = URL.createObjectURL(file);

    if (player) {
      // Update the player's source with the new file URL
      player.src({ src: fileURL, type: 'video/webm' });
    } else {
      // Initialize Video.js player if not already done
      initializePlayer(fileURL, file.type);
    }
  }
  showPlayer.value = true;
};
function convertSRTtoVTT(srt) {
      const vtt = 'WEBVTT\n\n' + srt
        .replace(/\r\n|\r|\n/g, '\n') // Normalize line breaks
        .replace(/(\d{2}):(\d{2}):(\d{2}),(\d{3})/g, '$1:$2:$3.$4') // Convert timestamps
        .replace(/^\d+\n/gm, ''); // Remove sequence numbers
      return vtt;
    }

// Initialize the Video.js player
const initializePlayer = (src, type) => {
  if (videoPlayer.value) {
    player = videojs(videoPlayer.value, {
      autoplay: false,
      controls: true,
      responsive: true,
      sources: [{ src, type }],
    });

    // Example event listener
    player.on("play", () => {
      console.log("Video started playing");
    });
  } else {
    console.error("Video element not found.");
  }
};
function handleSubtitles(event){
  const file = event.target.files[0];
  if (!file) {
        return;
      }

      // Read the subtitle file
      const reader = new FileReader();
      reader.onload = function (e) {
        const subtitleContent = e.target.result;

        // Create a Blob URL for the subtitle file
        const blob = new Blob([subtitleContent], { type: 'text/vtt' });
        const blobURL = URL.createObjectURL(blob);

        // Add the subtitle track to Video.js
        player.addRemoteTextTrack({
          src: blobURL,
          kind: 'subtitles',
          label: 'Custom Subtitles',
          default: true,
        });
      };

      // Check if the file is SRT and convert it if necessary
      if (file.name.endsWith('.srt')) {
        reader.onload = function (e) {
          const srtContent = e.target.result;
          const vttContent = convertSRTtoVTT(srtContent);

          // Create a Blob URL for the WebVTT subtitle file
          const blob = new Blob([vttContent], { type: 'text/vtt' });
          const blobURL = URL.createObjectURL(blob);

          // Add the subtitle track to Video.js
          player.addRemoteTextTrack({
            src: blobURL,
            kind: 'subtitles',
            label: 'Custom Subtitles',
            default: true,
          });
        };
        reader.readAsText(file);
      } else {
        // Read WebVTT directly
        reader.readAsText(file);
      }
}

// Lifecycle hooks
onMounted(() => {
  if (videoPlayer.value) {
    player = videojs(videoPlayer.value, {
      autoplay: false,
      controls: true,
    });
  } else {
    console.error("Video element not found on mount.");
  }
});

onBeforeUnmount(() => {
  // Dispose of the player on component destruction
  if (player) {
    player.dispose();
  }
});
</script>
<style scoped>
/* Custom styles for the player */
.vjs-matrix.video-js {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 100%;
  width: 100%;
}
.input{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}
</style>