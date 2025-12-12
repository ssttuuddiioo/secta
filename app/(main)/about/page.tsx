'use client'

import { InteractiveSphere } from '@/components/InteractiveSphere'
import { SocialIcons } from '@/components/SocialIcons'
import { Footer } from '@/components/Footer'
import { ContactForm } from '@/components/ContactForm'

// Real brand logos from Simple Icons
function HboIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M7.042 16.896H4.414v-3.754H2.708v3.754H.038V7.121h2.67v3.792h1.706V7.121h2.628v9.775zm6.407-9.775v6.451c0 .554.2 1.088.074 1.587-.249 1.058-1.2 1.839-2.708 1.839-1.507 0-2.46-.78-2.708-1.839-.125-.498-.074-1.033-.074-1.587V7.121h2.628v6.548c0 .274.137.548.411.548.274 0 .411-.274.411-.548V7.121h2.628-.662zm.091 9.775V7.121h3.79c1.756 0 3.168.95 3.168 2.96 0 1.13-.566 1.839-1.382 2.182.816.343 1.634 1.052 1.634 2.422 0 2.133-1.382 3.236-3.416 3.236h-3.794zm2.628-5.549h.737c.549 0 .959-.38.959-.926 0-.546-.41-.925-.959-.925h-.737v1.851zm0 3.532h.737c.678 0 1.088-.32 1.088-.996 0-.677-.41-.997-1.088-.997h-.737v1.993z"/>
    </svg>
  )
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
    </svg>
  )
}

function GrubhubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.032.0001C5.418-.0256.024 5.3496 0 12.0152c-.024 6.6158 5.3 11.9836 11.916 12.0093h.168c6.614-.0513 11.916-5.4448 11.916-12.0605C24 5.3753 18.648.0258 12.032.0001zm.072 3.6002c1.4288.0097 2.8377.4004 4.0498 1.1243l-.856 1.4726c-.9194-.5486-1.974-.8395-3.052-.8418-2.9144-.0071-5.6285 2.229-5.8283 5.2958-.2283 3.501 2.5966 6.0928 5.8 6.2718 1.8636.1041 3.562-.5948 4.7717-1.8285l.0034.0029v-2.7456H12.94v-1.9174h5.9234v5.3542l-.0027.0023.0027.0023v.4282l-.0456.0395c-1.6498 1.8399-4.0398 2.8918-6.5608 2.8918-.1478 0-.2961-.004-.4452-.0117-4.3752-.2225-7.7297-3.9587-7.5072-8.3562.2072-4.0976 3.5543-7.3245 7.7985-7.3245z"/>
    </svg>
  )
}

function FordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 4.92c-5.52 0-8.28 2.28-8.28 2.28 0 .6.36 2.04.36 2.04s-.12 4.56-.12 4.92c0 .36.24.48.84.48 0 0 2.28.12 3.6.12 1.32 0 1.68-.12 1.68-.72 0-.6-.12-1.32-.36-1.68-.24-.36-.36-.36-.6-.36H7.56s-.48 0-.48-.48c0-.48.48-.48.48-.48h2.88s.6 0 .6.48c0 .48-.24 1.56-.24 2.28 0 .72.36 1.2.36 1.2s.48.48 1.56.48c1.08 0 1.44-.36 1.44-.36s.36-.48.36-1.2c0-.72-.24-1.8-.24-2.28 0-.48.6-.48.6-.48h2.88s.48 0 .48.48c0 .48-.48.48-.48.48h-1.56c-.24 0-.36 0-.6.36-.24.36-.36 1.08-.36 1.68 0 .6.36.72 1.68.72 1.32 0 3.6-.12 3.6-.12.6 0 .84-.12.84-.48 0-.36-.12-4.92-.12-4.92s.36-1.44.36-2.04c0 0-2.76-2.28-8.28-2.28zm-4.44 1.8h8.88s.12 1.08.12 1.08H7.44s.12-1.08.12-1.08z"/>
    </svg>
  )
}

function FigmaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V8.981H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.047 4.539-4.563 4.539zm-.024-7.51a3.023 3.023 0 0 0-3.019 3.019c0 1.665 1.365 3.019 3.044 3.019 1.705 0 3.093-1.376 3.093-3.068v-2.97H8.148zm7.704 0h-.098c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h.098c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.49-4.49 4.49zm-.097-7.509c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h.098c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-.098z"/>
    </svg>
  )
}

function AmazonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.138-.06.234-.1.293-.13.226-.088.39-.046.525.13.12.174.09.336-.12.48-.256.19-.6.41-1.006.654-1.244.743-2.64 1.316-4.185 1.726a17.617 17.617 0 01-10.951-.577 17.88 17.88 0 01-5.43-3.35c-.1-.074-.151-.15-.151-.22 0-.047.021-.09.045-.122zm6.221-6.665c0-1.09.27-2.016.81-2.78a5.05 5.05 0 012.267-1.77c.96-.39 2.16-.59 3.6-.59l1.2.03V5.06c0-1.09-.12-1.83-.36-2.25-.24-.42-.67-.63-1.29-.63-.56 0-.98.16-1.26.48-.27.32-.41.83-.44 1.53l-3.87-.42c.18-1.53.69-2.68 1.53-3.44.84-.76 2.1-1.14 3.78-1.14 1.86 0 3.19.49 3.99 1.47.8.98 1.2 2.41 1.2 4.29v5.34c0 .57.03 1.12.09 1.65.06.53.15 1.01.27 1.44h-3.57l-.45-1.59c-.81 1.29-2.01 1.94-3.6 1.94-1.26 0-2.25-.39-2.97-1.17-.72-.78-1.08-1.8-1.08-3.06zm3.78-.59c0 .6.12 1.07.36 1.41.24.34.59.51 1.05.51.45 0 .87-.15 1.26-.45.39-.3.64-.66.75-1.08V9.5l-.96-.03c-1.64-.06-2.46.74-2.46 2.31zm8.64 9.9c-.18-.1-.27-.22-.27-.36 0-.12.06-.23.18-.33a14.92 14.92 0 002.01-2.19c.57-.76.86-1.46.86-2.1 0-.54-.18-.96-.54-1.26-.36-.3-.88-.45-1.56-.45-.42 0-.93.09-1.53.27-.6.18-1.11.42-1.53.72-.12.09-.24.18-.36.27-.12.09-.24.12-.36.12-.21 0-.33-.09-.36-.27a.87.87 0 01.09-.51c.09-.21.24-.45.45-.72.69-.87 1.53-1.53 2.52-1.98.99-.45 2.07-.68 3.24-.68 1.5 0 2.64.39 3.42 1.17.78.78 1.17 1.83 1.17 3.15 0 .84-.21 1.68-.63 2.52-.42.84-.99 1.62-1.71 2.34-.72.72-1.53 1.35-2.43 1.89-.12.09-.24.15-.36.18-.12.03-.21.03-.27 0z"/>
    </svg>
  )
}

function MetaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.239.76-.896 1.683-2.069 2.258-2.87l.252-.333.122.144c.664.79 1.463 1.682 2.257 2.403 1.244 1.13 2.476 1.895 3.936 1.895 1.727 0 2.81-.681 3.516-1.804.264-.38.473-.87.627-1.361.14-.452.233-.939.284-1.427.056-.521.085-1.06.085-1.604 0-2.576-.7-5.261-2.037-7.327C18.605 5.296 16.893 4.03 14.947 4.03c-1.635 0-2.749.755-3.986 2.247-.39.47-.78 1.003-1.144 1.53a33.473 33.473 0 0 0-.673.994l-.252.391-.165-.236a22.93 22.93 0 0 0-.39-.537 16.632 16.632 0 0 0-.97-1.196C6.079 5.19 5.238 4.03 6.915 4.03Zm0 1.382c.642 0 1.208.292 1.983 1.056.563.554 1.094 1.238 1.628 2.003.26.373.514.756.765 1.144l.26.405.112-.147c.305-.403.577-.756.865-1.092a15.14 15.14 0 0 1 .87-.962c.761-.756 1.39-1.407 2.649-1.407 1.432 0 2.738 1.047 3.71 2.665 1.087 1.809 1.71 4.183 1.71 6.402 0 .46-.024.91-.074 1.34a5.302 5.302 0 0 1-.216 1.095 3.586 3.586 0 0 1-.432.96c-.456.676-1.136 1.106-2.269 1.106-1.2 0-2.22-.678-3.357-1.71a24.39 24.39 0 0 1-2.032-2.156l-.144-.17-.118.154a26.18 26.18 0 0 1-2.066 2.333c-1.226 1.168-2.2 1.549-3.312 1.549-1.2 0-1.998-.397-2.508-1.15a3.434 3.434 0 0 1-.255-.514 4.714 4.714 0 0 1-.198-.655 6.374 6.374 0 0 1-.17-1.504c0-2.29.615-4.67 1.694-6.551.969-1.69 2.235-2.66 3.526-2.66Zm-.07 3.239c-.36 0-.753.168-1.155.61-.453.497-.918 1.262-1.333 2.197-.634 1.427-1.072 3.203-1.072 4.928 0 .46.042.86.122 1.19.072.295.17.53.28.696.09.135.167.22.23.27.074.057.157.074.308.074.605 0 1.178-.346 1.948-1.11.654-.649 1.368-1.553 2.053-2.54l.037-.053-.045-.057c-.654-.83-1.281-1.734-1.792-2.604a14.854 14.854 0 0 1-.727-1.378c-.168-.366-.319-.736-.436-1.085a4.89 4.89 0 0 1-.205-.853 2.03 2.03 0 0 1-.021-.278c.005-.008-.07-.007-.192-.007Zm8.096 0c-.168 0-.292.024-.357.082a2.094 2.094 0 0 0-.086.272c-.053.196-.116.435-.198.7-.103.327-.227.68-.376 1.04-.188.452-.41.925-.663 1.404-.51.97-1.137 1.971-1.79 2.862l-.046.063.047.063c.69.921 1.376 1.761 2.026 2.417.702.71 1.336 1.127 2.02 1.127.464 0 .865-.165 1.183-.563.28-.352.465-.873.593-1.484a8.93 8.93 0 0 0 .134-1.577c0-1.962-.531-4.093-1.403-5.627-.457-.804-.968-1.348-1.501-1.628-.246-.131-.491-.151-.583-.151Z"/>
    </svg>
  )
}

function CourseraIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.374 23.977c-4.183-.21-8.006-2.626-9.959-6.347-2.097-3.858-1.871-8.864.732-12.454C4.748 1.338 9.497-.698 14.281.23c4.583.857 8.351 4.494 9.358 8.911 1.122 4.344-.423 9.173-3.925 12.04-2.289 1.953-5.295 2.956-8.34 2.797zm6.817-8.4c-.494-1.711-1.635-3.022-3.657-3.477-.654-.122-1.479-.09-2.023.168-.544.344-.544.822-.109 1.387.163.108.382.163.545.217 1.744.38 2.67 1.31 2.942 2.887-.927.326-1.853.707-2.888.597-.708-.098-1.199-.543-1.308-1.251-.055-.653.163-1.197.653-1.632 1.58-1.47 4.196-1.143 5.341.653.708 1.034.708 2.56-.109 3.703-.925 1.306-2.397 1.905-4.031 1.796a5.403 5.403 0 0 1-4.032-2.124c-1.47-1.96-1.525-5.017-.109-7.031 1.362-1.96 4.086-3.103 6.429-2.56 2.56.598 4.358 2.18 5.177 4.683.163.489.272.98.327 1.47 0 .054.054.163-.055.217-.653.327-1.307.598-2.015.926-.055-.218-.055-.38-.109-.598l.021-.031z"/>
    </svg>
  )
}

function NickelodeonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M9.112 3.041H6.79L0 20.959h2.463l1.557-4.335h5.078l1.557 4.335h2.533L9.112 3.041zm-4.19 11.341l1.885-5.198 1.885 5.198H4.922zM24 8.165h-2.322V3.041H13.42v17.918h2.322V11.207h3.864v9.752H24V8.165z"/>
    </svg>
  )
}

function UberEatsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.995 15.36h-.638v-4.095h-1.917v5.69h2.555c1.332 0 2.126-.726 2.126-1.926 0-1.17-.794-1.669-2.126-1.669zm0 2.39h-.638v-1.196h.638c.474 0 .754.19.754.598 0 .407-.28.598-.754.598zM12.486 11.265h-2.879v5.69h2.89c1.368 0 2.35-.72 2.35-1.92 0-.642-.31-1.14-.835-1.41.41-.268.665-.72.665-1.28 0-1.098-.845-1.68-2.191-1.68zm-.197 2.36h-.767v-1.196h.767c.428 0 .687.178.687.58 0 .402-.26.616-.687.616zm.119 2.165h-.886v-1.2h.886c.452 0 .722.19.722.61 0 .42-.27.59-.722.59zm-5.79-4.525h-1.92v5.69H6.62v-2.065h1.499v-1.34H6.62v-1.06h1.738v1.455h1.917v-2.68zM2.16 16.955h1.921v-5.69H2.16v5.69zm19.682-4.525h-1.915v.985c-.26-.616-.864-.985-1.584-.985-1.326 0-2.198.94-2.198 2.447 0 1.52.872 2.446 2.197 2.446.721 0 1.33-.38 1.585-.996v.628h1.915v-4.525zm-2.96 3.21c-.573 0-.969-.433-.969-1.163s.396-1.163.969-1.163c.574 0 .97.434.97 1.163s-.396 1.163-.97 1.163zM3.12 6.025C1.4 6.025 0 7.425 0 9.145v2.73h2.16V9.356c0-.666.42-1.096.96-1.096.545 0 .96.43.96 1.096v2.518h2.16v-2.73c0-1.72-1.4-3.12-3.12-3.12z"/>
    </svg>
  )
}

function EbayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M5.869 8.326c-2.48 0-4.127 1.049-4.127 3.192 0 1.474.793 2.299 2.174 2.637v.037c-1.2.263-1.774.993-1.774 1.917 0 .842.556 1.542 1.793 1.768v.037c-1.467.244-2.192 1.067-2.192 2.155 0 1.58 1.474 2.47 4.047 2.47 2.983 0 4.503-1.217 4.503-3.318 0-1.71-1.068-2.461-3.098-2.461h-2.27c-.618 0-.899-.17-.899-.524 0-.356.23-.572.617-.696.319.07.649.108 1.037.108 2.36 0 3.91-1.067 3.91-2.99 0-.71-.263-1.298-.706-1.71h1.93l.318-.787h-.012l-3.379.012c-.6-.224-1.286-.356-2.037-.356h.165v-.493zm-.238 1.186c.936 0 1.475.593 1.475 1.736 0 1.142-.54 1.736-1.475 1.736-.936 0-1.474-.594-1.474-1.736 0-1.143.538-1.736 1.474-1.736zm13.238-1.186c-2.05 0-3.442 1.374-3.442 3.442v.337h-1.005c.706.49 1.165 1.13 1.29 1.919h1.068c.085-.65.253-1.088.506-1.435h-1.86v-.821c0-1.261.636-2.055 1.85-2.055.873 0 1.38.432 1.38 1.163 0 .519-.243.871-.656 1.156.918.264 1.567.898 1.567 1.888 0 1.506-1.23 2.342-3.09 2.342-1.824 0-3.067-.84-3.067-2.274 0-.997.562-1.68 1.466-1.966a1.965 1.965 0 0 1-.665-1.467c0-1.381 1.154-2.229 2.88-2.229.444 0 .852.058 1.218.165h2.573v.835h-2.013zm-9.032 0c-2.268 0-3.722 1.38-3.722 3.536s1.454 3.535 3.722 3.535c.862 0 1.611-.2 2.21-.557v-1.163c-.512.45-1.2.72-1.985.72-1.33 0-2.136-.742-2.249-1.991H13.7v-.544c0-2.168-1.356-3.536-3.363-3.536h-1.5zm-.244 1c1.054 0 1.67.693 1.737 1.867H7.887c.155-1.174.772-1.867 1.706-1.867zm12.593 8.042h-2.543c-.993 0-1.336.288-1.336.868 0 .675.521.98 1.837.98 1.686 0 2.554-.488 2.554-1.479 0-.18-.034-.302-.094-.369h-.418z"/>
    </svg>
  )
}

function ParamountIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .476L.567 11.912 12 23.523 23.433 11.912 12 .476zm0 2.84l8.523 8.596L12 20.508 3.477 11.912 12 3.316z"/>
    </svg>
  )
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  )
}

function AmtrakIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.998 11.998a2.4 2.4 0 01-2.4 2.4H16.8V16.8a1.2 1.2 0 01-1.2 1.2h-.002a1.2 1.2 0 01-1.198-1.2v-2.402h-4.8V16.8a1.2 1.2 0 01-1.2 1.2H8.4A1.2 1.2 0 017.2 16.8v-2.402H2.4a2.4 2.4 0 010-4.8h4.8V7.2A1.2 1.2 0 018.4 6h.002A1.2 1.2 0 019.6 7.2v2.398h4.8V7.2A1.2 1.2 0 0115.6 6h.002a1.2 1.2 0 011.198 1.2v2.398h4.8a2.4 2.4 0 012.4 2.4z"/>
    </svg>
  )
}

function UnderArmourIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.653 3.453 4.2 6.621 4.2 8.4c0 2.86 2.455 5.33 5.85 7.166L12 24l1.95-8.434C17.345 13.73 19.8 11.26 19.8 8.4c0-1.779-1.453-4.947-7.8-8.4zm0 2.27c3.348 2.026 5.4 4.072 5.4 6.13 0 2.058-1.47 3.9-3.9 5.4L12 19.2l-1.5-5.4c-2.43-1.5-3.9-3.342-3.9-5.4 0-2.058 2.052-4.104 5.4-6.13z"/>
    </svg>
  )
}

function ChipotleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.224 8.002C8.002 10.003 5.898 16.173 3.818 21.343l1.892.657.948-2.302c.479.17.979.3 1.342.3C19.002 20 22.002 3 22.002 3c-1 2-8 2.25-13 3.25S2.002 11.5 2.002 13.5s1.75 3.75 1.75 3.75c3.25-9.25 13.472-9.248 13.472-9.248z"/>
    </svg>
  )
}

function WalmartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.006.077a.756.756 0 00-.479.2c-.426.324-.587.873-.587 1.376v4.096c0 .318.163.63.437.768l.31.16.299-.16a.863.863 0 00.437-.768V1.653c0-.503-.16-1.052-.587-1.376a.777.777 0 00-.479-.2h.649zm4.874 2.6a.84.84 0 00-.43.108c-.41.218-.59.744-.459 1.233l1.283 3.893a.791.791 0 00.759.5l.343-.043.199-.273a.79.79 0 00.098-.763L17.39 3.44c-.187-.474-.557-.764-.98-.764h-.002a1.033 1.033 0 00-.25.027l-.002-.026zm-9.75 0l-.002.025a1.034 1.034 0 00-.251-.027h-.002c-.424 0-.794.29-.98.764l-1.283 3.892a.79.79 0 00.098.763l.2.273.342.043a.791.791 0 00.759-.5l1.283-3.893c.131-.489-.05-1.015-.46-1.233a.84.84 0 00-.429-.108l.725.001zM3.211 9.35a.89.89 0 00-.302.053c-.403.145-.646.617-.559 1.11l.672 3.827a.791.791 0 00.639.631l.346.016.251-.236c.245-.23.337-.581.213-.879l-1.461-3.497c-.189-.45-.576-.695-.969-.695a.918.918 0 00-.274.034l-.002-.362zm17.578 0v.362a.919.919 0 00-.274-.034c-.393 0-.78.245-.97.695L18.087 13.87a.79.79 0 00.212.88l.252.236.345-.016a.791.791 0 00.64-.631l.672-3.828c.087-.492-.156-.964-.56-1.11a.89.89 0 00-.301-.052h-.568zm-8.783 4.615a.756.756 0 00-.479.2c-.426.324-.587.873-.587 1.376v2.47c0 .318.163.63.437.768l.31.16.299-.16a.863.863 0 00.437-.768v-2.47c0-.503-.16-1.052-.587-1.376a.777.777 0 00-.479-.2h.649z"/>
    </svg>
  )
}

function JohnDeereIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 1.846c5.598 0 10.154 4.556 10.154 10.154S17.598 22.154 12 22.154 1.846 17.598 1.846 12 6.402 1.846 12 1.846zm0 2.77c-1.623 0-3.116.534-4.327 1.433l.696.696c1.052-.703 2.313-1.115 3.67-1.115 3.67 0 6.646 2.976 6.646 6.646 0 1.357-.412 2.618-1.115 3.67l.696.696c.899-1.211 1.433-2.704 1.433-4.327A7.4 7.4 0 0012 4.616zm-5.654 2.76l-.696.696c-.703 1.052-1.115 2.313-1.115 3.67 0 3.67 2.976 6.646 6.646 6.646 1.357 0 2.618-.412 3.67-1.115l-.696-.696c-1.052.703-2.313 1.115-3.67 1.115-3.67 0-6.646-2.976-6.646-6.646 0-1.357.412-2.618 1.115-3.67l-.608.001zM12 8.308a3.692 3.692 0 100 7.384 3.692 3.692 0 000-7.384z"/>
    </svg>
  )
}

function PgaTourIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 1.5c5.799 0 10.5 4.701 10.5 10.5S17.799 22.5 12 22.5 1.5 17.799 1.5 12 6.201 1.5 12 1.5zM9.75 6v3h-3v1.5h3V12h1.5v-1.5h3V9h-3V6h-1.5zm2.25 7.5c-2.485 0-4.5 2.015-4.5 4.5h1.5c0-1.657 1.343-3 3-3s3 1.343 3 3h1.5c0-2.485-2.015-4.5-4.5-4.5z"/>
    </svg>
  )
}

function BloombergIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M0 5.72v12.56h5.875c2.094 0 3.461-.703 4.125-1.742.398-.586.586-1.32.586-2.133 0-.937-.258-1.687-.82-2.273-.376-.398-.89-.68-1.524-.867.516-.235.914-.54 1.196-.96.352-.516.515-1.126.515-1.805 0-.773-.187-1.406-.562-1.898-.633-.82-1.711-1.242-3.258-1.242H0v.36zm2.508 1.687h3.086c.68 0 1.172.14 1.5.422.305.258.445.633.445 1.102 0 .515-.164.914-.492 1.195-.328.258-.82.399-1.453.399H2.508V7.407zm0 4.898h3.375c.703 0 1.219.165 1.57.47.329.28.493.679.493 1.171 0 .516-.164.938-.516 1.219-.351.305-.867.445-1.547.445H2.508v-3.305zM24 5.72h-2.508v5.344h-3.234V5.72h-2.532v5.344h-3.234V5.72H9.984v12.56h2.508v-5.39h3.234v5.39h2.532v-5.39h3.234v5.39H24V5.72z"/>
    </svg>
  )
}

function MassMutualIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0L0 6v12l12 6 12-6V6L12 0zm0 2.18l9.273 4.636L12 11.453 2.727 6.816 12 2.18zM2.182 8.182l9.273 4.636v8.364L2.182 16.545V8.182zm19.636 0v8.363l-9.273 4.637v-8.364l9.273-4.636z"/>
    </svg>
  )
}

function ChivasRegalIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v5.7c0 4.47-3.07 8.65-7 9.8V3.18zm-7 3.12l7-3.12v16.62c-3.93-1.15-7-5.33-7-9.8V6.3z"/>
    </svg>
  )
}

// Featured clients with real brand icons
const allFeaturedClients = [
  { name: 'HBO', icon: HboIcon },
  { name: 'Google', icon: GoogleIcon },
  { name: 'Grubhub', icon: GrubhubIcon },
  { name: 'Ford', icon: FordIcon },
  { name: 'Figma', icon: FigmaIcon },
  { name: 'Amazon', icon: AmazonIcon },
  { name: 'Meta', icon: MetaIcon },
  { name: 'Coursera', icon: CourseraIcon },
  { name: 'Nickelodeon', icon: NickelodeonIcon },
  { name: 'UberEats', icon: UberEatsIcon },
  { name: 'eBay', icon: EbayIcon },
  { name: 'Paramount', icon: ParamountIcon },
  { name: 'YouTube', icon: YoutubeIcon },
  { name: 'Amtrak', icon: AmtrakIcon },
  { name: 'Under Armour', icon: UnderArmourIcon },
  { name: 'Chipotle', icon: ChipotleIcon },
  { name: 'Walmart', icon: WalmartIcon },
  { name: 'John Deere', icon: JohnDeereIcon },
  { name: 'PGA Tour', icon: PgaTourIcon },
  { name: 'Bloomberg', icon: BloombergIcon },
  { name: 'MassMutual', icon: MassMutualIcon },
  { name: 'Chivas Regal', icon: ChivasRegalIcon },
]

// Industry tags
const industries = [
  'Retail',
  'Entertainment',
  'Consumer Goods',
  'Food & Beverage',
  'Spirits',
  'Fashion',
  'Sports',
  'Technology',
  'Healthcare',
  'Hospitality',
  'Real Estate',
  'Corporate'
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FFF9DF] flex flex-col">
      <div className="bg-[#FFAF34] text-black">
        <SocialIcons />
        <div className="pt-32 pb-20 px-6 md:px-12" style={{ paddingTop: '100px' }}>
        <div className="max-w-7xl mx-auto">
          
          {/* Hero and About Us - Two Column Layout */}
          <section className="mb-24 md:mb-32 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-stretch">
            {/* Left Column - Interactive Sphere */}
            <div className="w-full flex items-stretch justify-center" style={{ aspectRatio: '1 / 1', maxWidth: '100%' }}>
              <InteractiveSphere 
                fillColor="#FFAF34"
                lineColor="#000000"
                cameraZoom={40.5}
                widthSegments={16}
                heightSegments={14}
                horizontalStrokeWidth={5.2}
                verticalStrokeWidth={5.1}
                strokeOpacity={1}
                mouseDelay={0.1}
              />
            </div>

            {/* Right Column - About Us */}
            <div>
              <div className="space-y-6">
                <p
                  className="text-lg md:text-xl text-black leading-relaxed"
                  style={{
                    fontFamily: 'var(--font-sofia-sans)',
                  }}
                >
                  Secta is a New York and California based content production studio specializing in experiential activations, branded video, and social media storytelling. With over 10 years of experience, we create immersive brand experiences and cinematic content for clients across retail, entertainment, tech, hospitality, and consumer brands.
                </p>
                <div className="grid grid-cols-1 gap-6 mt-8">
                  <div>
                    <h3
                      className="text-lg font-semibold text-black mb-3"
                      style={{
                        fontFamily: 'var(--font-sofia-sans)',
                      }}
                    >
                      Location
                    </h3>
                    <p
                      className="text-base text-black/80"
                      style={{
                        fontFamily: 'var(--font-sofia-sans)',
                      }}
                    >
                      New York and California
             
                    </p>
                  </div>
                  <div>
                    <h3
                      className="text-lg font-semibold text-black mb-3"
                      style={{
                        fontFamily: 'var(--font-sofia-sans)',
                      }}
                    >
                      Experience
                    </h3>
                    <p
                      className="text-base text-black/80"
                      style={{
                        fontFamily: 'var(--font-sofia-sans)',
                      }}
                    >
                      Over 10 years crafting experiential activations and visual content
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* What We Do Section - Three Columns */}
          <section className="mb-24 md:mb-32">
            <h2
              className="text-3xl md:text-4xl font-bold text-black uppercase tracking-tight mb-12"
              style={{
                fontFamily: 'var(--font-sofia-sans)',
              }}
            >
              What We Do
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {/* Motion Column */}
              <div className="group">
                <h3
                  className="text-2xl md:text-3xl font-bold text-black uppercase mb-6 group-hover:text-black/80 transition-colors"
                  style={{
                    fontFamily: 'var(--font-sofia-sans)',
                  }}
                >
                  Motion
                </h3>
                <ul className="space-y-3">
                  <li className="text-base text-black/80" style={{ fontFamily: 'var(--font-sofia-sans)' }}>
                    • Branded films and commercials
                  </li>
                  <li className="text-base text-black/80" style={{ fontFamily: 'var(--font-sofia-sans)' }}>
                    • Social media video (Instagram, TikTok, YouTube)
                  </li>
                  <li className="text-base text-black/80" style={{ fontFamily: 'var(--font-sofia-sans)' }}>
                    • Documentary-style storytelling
                  </li>
                  <li className="text-base text-black/80" style={{ fontFamily: 'var(--font-sofia-sans)' }}>
                    • Product videos and demo reels
                  </li>
                  <li className="text-base text-black/80" style={{ fontFamily: 'var(--font-sofia-sans)' }}>
                    • Event recap films
                  </li>
                </ul>
              </div>

              {/* Stills Column */}
              <div className="group">
                <h3
                  className="text-2xl md:text-3xl font-bold text-black uppercase mb-6 group-hover:text-black/80 transition-colors"
                  style={{
                    fontFamily: 'var(--font-sofia-sans)',
                  }}
                >
                  Stills
                </h3>
                <ul className="space-y-3">
                  <li className="text-base text-black/80" style={{ fontFamily: 'var(--font-sofia-sans)' }}>
                    • Event photography
                  </li>
                  <li className="text-base text-black/80" style={{ fontFamily: 'var(--font-sofia-sans)' }}>
                    • Product and lifestyle shoots
                  </li>
                  <li className="text-base text-black/80" style={{ fontFamily: 'var(--font-sofia-sans)' }}>
                    • Brand content creation
                  </li>
                  <li className="text-base text-black/80" style={{ fontFamily: 'var(--font-sofia-sans)' }}>
                    • Behind-the-scenes documentation
                  </li>
                  <li className="text-base text-black/80" style={{ fontFamily: 'var(--font-sofia-sans)' }}>
                    • Social media imagery
                  </li>
                </ul>
              </div>

              {/* Experiential Column */}
              <div className="group">
                <h3
                  className="text-2xl md:text-3xl font-bold text-black uppercase mb-6 group-hover:text-black/80 transition-colors"
                  style={{
                    fontFamily: 'var(--font-sofia-sans)',
                  }}
                >
                  Experiential
                </h3>
                <ul className="space-y-3">
                  <li className="text-base text-black/80" style={{ fontFamily: 'var(--font-sofia-sans)' }}>
                    • Immersive brand activations
                  </li>
                  <li className="text-base text-black/80" style={{ fontFamily: 'var(--font-sofia-sans)' }}>
                    • Pop-up experiences
                  </li>
                  <li className="text-base text-black/80" style={{ fontFamily: 'var(--font-sofia-sans)' }}>
                    • Live event production
                  </li>
                  <li className="text-base text-black/80" style={{ fontFamily: 'var(--font-sofia-sans)' }}>
                    • Creative direction
                  </li>
                  <li className="text-base text-black/80" style={{ fontFamily: 'var(--font-sofia-sans)' }}>
                    • Multi-sensory installations
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Approach/Process Section */}
          <section className="mb-24 md:mb-32">
            <h2
              className="text-3xl md:text-4xl font-bold text-black uppercase tracking-tight mb-12"
              style={{
                fontFamily: 'var(--font-sofia-sans)',
              }}
            >
              Our Approach
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              <div>
                <h3
                  className="text-xl md:text-2xl font-bold text-black mb-4"
                  style={{
                    fontFamily: 'var(--font-sofia-sans)',
                  }}
                >
                  Concept
                </h3>
                <p
                  className="text-base text-black/80"
                  style={{
                    fontFamily: 'var(--font-sofia-sans)',
                  }}
                >
                  Clear creative direction and collaborative partnerships from the start.
                </p>
              </div>
              <div>
                <h3
                  className="text-xl md:text-2xl font-bold text-black mb-4"
                  style={{
                    fontFamily: 'var(--font-sofia-sans)',
                  }}
                >
                  Production
                </h3>
                <p
                  className="text-base text-black/80"
                  style={{
                    fontFamily: 'var(--font-sofia-sans)',
                  }}
                >
                  Building strong relationships with clients and crew, ensuring every project benefits from the right talent.
                </p>
              </div>
              <div>
                <h3
                  className="text-xl md:text-2xl font-bold text-black mb-4"
                  style={{
                    fontFamily: 'var(--font-sofia-sans)',
                  }}
                >
                  Delivery
                </h3>
                <p
                  className="text-base text-black/80"
                  style={{
                    fontFamily: 'var(--font-sofia-sans)',
                  }}
                >
                  Exceptional work that exceeds expectations and drives results.
                </p>
              </div>
            </div>
          </section>

          {/* Industries & Clients Section */}
          <section className="mb-24 md:mb-32">
            <h2
              className="text-3xl md:text-4xl font-bold text-black uppercase tracking-tight mb-8"
              style={{
                fontFamily: 'var(--font-sofia-sans)',
              }}
            >
              Industries & Clients
            </h2>
            
            {/* Industry Tags */}
            <div className="flex flex-wrap gap-3 mb-12">
              {industries.map((industry, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-black/10 text-black rounded-full text-sm font-medium hover:bg-black/20 transition-colors"
                  style={{
                    fontFamily: 'var(--font-sofia-sans)',
                  }}
                >
                  {industry}
                </span>
              ))}
            </div>

            {/* Client Logos Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6 md:gap-8">
              {allFeaturedClients.map((client, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center gap-2 group"
                >
                  <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center text-black/80 group-hover:text-black transition-colors">
                    <client.icon className="w-full h-full" />
                  </div>
                  <span 
                    className="text-xs md:text-sm text-black/70 text-center leading-tight"
                    style={{ fontFamily: 'var(--font-sofia-sans)' }}
                  >
                    {client.name}
                  </span>
                </div>
              ))}
            </div>
            
            <p
              className="text-base text-black/70 mt-8"
              style={{
                fontFamily: 'var(--font-sofia-sans)',
              }}
            >
              Serving clients in NYC, LA, and nationwide
            </p>
          </section>

        </div>

        {/* Contact Form Section */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
            {/* Left Column - Call to Action */}
            <div className="flex flex-col justify-start">
              <h2
                className="text-3xl md:text-4xl font-bold text-black uppercase tracking-tight mb-6"
                style={{
                  fontFamily: 'var(--font-sofia-sans)',
                }}
              >
                Let's Create Together
              </h2>
              <p
                className="text-lg md:text-xl text-black/80 leading-relaxed mb-4"
                style={{
                  fontFamily: 'var(--font-sofia-sans)',
                }}
              >
                Have a project in mind? We'd love to hear about it. Whether you're planning an experiential activation, need cinematic video content, or want to elevate your brand's visual storytelling—drop us a note.
              </p>
              <p
                className="text-base text-black/70"
                style={{
                  fontFamily: 'var(--font-sofia-sans)',
                }}
              >
                We typically respond within 24 hours.
              </p>
            </div>
            
            {/* Right Column - Contact Form */}
            <div>
              <ContactForm 
                isOpen={true} 
                variant="light"
              />
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <Footer 
          variant="light"
        />
      </div>
      </div>
    </div>
  )
}
