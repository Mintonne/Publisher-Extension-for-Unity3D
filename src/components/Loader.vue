<template>
  <!-- Redirecting Loader by Mr Alien  -->
  <!-- https://codepen.io/mr_alien/pen/FDLjg -->
  <transition name="fade" appear>
    <div class="animation-overlay" :style="{backgroundColor: color}">
      <div class='body'>
        <span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </span>
        <div class='base'>
          <span></span>
          <div class='face'></div>
        </div>
      </div>
      <div class='longfazers'>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <h1>{{ message }}</h1>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      default: 'Loading'
    },
    color: {
      type: String,
      default: '#2c3e50'
    }
  }
}
</script>

<style lang="scss" scoped>
$red: #f4512c;

.animation-overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  overflow: hidden;
  z-index: 1000;
  opacity: 0.75;
  transition-property: opacity;
  transition-duration: 0.5s;

  &.fade-enter,
  &.fade-leave-to {
    opacity: 0;
  }

  .body {
    position: absolute;
    top: 50%;
    margin-left: -50px;
    left: 50%;
    animation: speeder 0.4s linear infinite;

    > span {
      height: 5px;
      width: 35px;
      background: $red;
      position: absolute;
      top: -19px;
      left: 60px;
      border-radius: 2px 10px 1px 0;
    }

    .base {
      span {
        position: absolute;
        width: 0;
        height: 0;
        border-top: 6px solid transparent;
        border-right: 100px solid white;
        border-bottom: 6px solid transparent;

        &:before {
          content: "";
          height: 22px;
          width: 22px;
          border-radius: 50%;
          background: white;
          position: absolute;
          right: -110px;
          top: -16px;
        }

        &:after {
          content: "";
          position: absolute;
          width: 0;
          height: 0;
          border-top: 0 solid transparent;
          border-right: 55px solid white;
          border-bottom: 16px solid transparent;
          top: -16px;
          right: -98px;
        }
      }

      .face {
        position: absolute;
        height: 12px;
        width: 20px;
        background: white;
        border-radius: 20px 20px 0 0;
        transform: rotate(-40deg);
        right: -125px;
        top: -15px;

        &:after {
          content: "";
          height: 12px;
          width: 12px;
          background: white;
          right: 4px;
          top: 7px;
          position: absolute;
          transform: rotate(40deg);
          transform-origin: 50% 50%;
          border-radius: 0 0 0 2px;
        }
      }
    }

    > span > span {
      width: 30px;
      height: 1px;
      background: $red;
      position: absolute;

      &:nth-child(1) {
        animation: fazer1 0.2s linear infinite;
      }

      &:nth-child(2) {
        top: 3px;
        animation: fazer2 0.4s linear infinite;
      }

      &:nth-child(3) {
        top: 1px;
        animation: fazer3 0.4s linear infinite;
        animation-delay: -1s;
      }

      &:nth-child(4) {
        top: 4px;
        animation: fazer4 1s linear infinite;
        animation-delay: -1s;
      }
    }
  }

  .longfazers {
    position: absolute;
    width: 100%;
    height: 100%;

    span {
      position: absolute;
      height: 1px;
      width: 20%;
      background: white;
      opacity: 0.2;

      &:nth-child(1) {
        top: 20%;
        animation: anim-lf 0.3s linear infinite;
        animation-delay: -2.5s;
      }

      &:nth-child(2) {
        top: 40%;
        animation: anim-lf 0.4s linear infinite;
        animation-delay: -2.5s;
      }

      &:nth-child(3) {
        top: 60%;
        animation: anim-lf 0.3s linear infinite;
      }

      &:nth-child(4) {
        top: 80%;
        animation: anim-lf 0.25s linear infinite;
        animation-delay: -1.5s;
      }
    }
  }

  h1 {
    color: white;
    position: absolute;
    top: 55%;
    width: 100%;
    padding-left: 60px;
    font-size: 18px;
  }
}

@keyframes fazer1 {
  0% {
    left: 0;
  }

  100% {
    left: -78px;
    opacity: 0;
  }
}

@keyframes fazer2 {
  0% {
    left: 0;
  }

  100% {
    left: -97px;
    opacity: 0;
  }
}

@keyframes fazer3 {
  0% {
    left: 0;
  }

  100% {
    left: -49px;
    opacity: 0;
  }
}

@keyframes fazer4 {
  0% {
    left: 0;
  }

  100% {
    left: -146px;
    opacity: 0;
  }
}

@keyframes speeder {
  0% {
    transform: translate(2px, 1px) rotate(0deg);
  }

  10% {
    transform: translate(-1px, -3px) rotate(-1deg);
  }

  20% {
    transform: translate(-2px, 0px) rotate(1deg);
  }

  30% {
    transform: translate(1px, 2px) rotate(0deg);
  }

  40% {
    transform: translate(1px, -1px) rotate(1deg);
  }

  50% {
    transform: translate(-1px, 3px) rotate(-1deg);
  }

  60% {
    transform: translate(-1px, 1px) rotate(0deg);
  }

  70% {
    transform: translate(3px, 1px) rotate(-1deg);
  }

  80% {
    transform: translate(-2px, -1px) rotate(1deg);
  }

  90% {
    transform: translate(2px, 1px) rotate(0deg);
  }

  100% {
    transform: translate(1px, -2px) rotate(-1deg);
  }
}

@keyframes anim-lf {
  0% {
    left: 80%;
  }

  100% {
    left: 0%;
    opacity: 0;
  }
}
</style>
