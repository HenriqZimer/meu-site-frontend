<template>
  <div class="hero-image-container position-relative">
    <!-- Main Avatar -->
    <div class="avatar-wrapper">
      <v-avatar :size="size" class="hero-avatar">
        <v-img :src="imageUrl" :alt="imageAlt" eager cover />
      </v-avatar>
      <div class="avatar-ring" />
      <div class="avatar-glow" />
    </div>

    <!-- Floating Tech Badges -->
    <div class="floating-badge badge-kubernetes">
      <v-icon icon="mdi-kubernetes" size="28" color="primary" />
    </div>
    <div class="floating-badge badge-docker">
      <v-icon icon="mdi-docker" size="28" color="info" />
    </div>
    <div class="floating-badge badge-aws">
      <IconWrapper icon="devicon:amazonwebservices" :size="28" color="warning" />
    </div>
    <div class="floating-badge badge-infinity">
      <v-icon icon="mdi-infinity" size="28" color="primary" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { IMAGE_URLS } from '~/constants'

withDefaults(
  defineProps<{
    imageUrl?: string
    imageAlt?: string
    size?: number
  }>(),
  {
    imageUrl: IMAGE_URLS.PROFILE_PHOTO,
    imageAlt: 'Foto profissional',
    size: 320,
  }
)
</script>

<style scoped>
.hero-image-container {
  animation: fadeInLeft 1s ease 0.5s both;
}

.avatar-wrapper {
  position: relative;
  display: inline-block;
}

.hero-avatar {
  border: 4px solid rgba(59, 130, 246, 0.3);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.hero-avatar:hover {
  transform: scale(1.05);
  border-color: rgba(59, 130, 246, 0.6);
  box-shadow: 0 25px 70px rgba(59, 130, 246, 0.4);
}

.avatar-ring {
  position: absolute;
  inset: -20px;
  border-radius: 50%;
  border: 2px solid rgba(59, 130, 246, 0.2);
  animation: rotate 20s linear infinite;
  z-index: 1;
}

.avatar-glow {
  position: absolute;
  inset: -40px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
  animation: pulse 3s ease-in-out infinite;
  z-index: 0;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.05);
  }
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Floating Badges */
.floating-badge {
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: rgba(30, 41, 59, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(59, 130, 246, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  animation: float 6s ease-in-out infinite;
}

.floating-badge:hover {
  transform: translateY(-5px) scale(1.1);
  box-shadow: 0 12px 40px rgba(59, 130, 246, 0.5);
}

.badge-kubernetes {
  top: 10%;
  right: 10%;
}

.badge-docker {
  top: 50%;
  right: 0;
  animation-delay: 1s;
}

.badge-aws {
  bottom: 20%;
  right: 15%;
  animation-delay: 2s;
}

.badge-infinity {
  top: 35%;
  left: -10%;
  animation-delay: 3s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@media (max-width: 960px) {
  .floating-badge {
    width: 50px;
    height: 50px;
  }

  .avatar-ring {
    inset: -10px;
  }

  .avatar-glow {
    inset: -20px;
  }
}

@media (max-width: 600px) {
  .floating-badge {
    width: 45px;
    height: 45px;
  }

  .badge-infinity {
    left: 0;
  }

  .avatar-ring {
    inset: -10px;
  }

  .avatar-glow {
    inset: -20px;
  }
}
</style>
