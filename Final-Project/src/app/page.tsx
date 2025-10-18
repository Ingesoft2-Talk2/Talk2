import {
  Globe,
  MessageCircle,
  Monitor,
  Shield,
  Smartphone,
  Video,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import LPFirst from "@/assets/landing-page/video-chat.svg";
import NavBar from "@/components/landing-page/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black">
      <div className="p-6 sm:p-10 max-w-screen-xl mx-auto">
        <NavBar />
      </div>

      <div className="flex flex-col items-center justify-center gap-12 px-6 sm:px-10 lg:px-16 xl:px-24 max-w-screen-xl mx-auto lg:flex-row">
        <div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Connect. Talk. Collaborate with{" "}
            <span className="text-blue-600">Talk2</span>
          </h1>
          <p className="py-6 text-base md:text-lg text-gray-600">
            Talk2 makes video meetings effortless. Whether you're working with
            your team, meeting clients, or catching up with friends, enjoy
            secure and reliable video calls anytime, anywhere.
          </p>
          <Link
            href="#"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
        </div>

        <div className="relative mt-8 lg:mt-0">
          <Image
            src={LPFirst}
            alt="LPFirst"
            width={675}
            height={609}
            className="w-3/4 sm:w-2/3 lg:w-full h-auto mx-auto"
            priority
          />
        </div>
      </div>

      <section className="pt-20 mt-3">
        <div className="max-w-screen-xl mx-auto px-6 sm:px-10 lg:px-16 xl:px-24">
          <div className="bg-gray-100 rounded-2xl p-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              Why choose <span className="text-blue-600">Talk2</span>?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              <div className="rounded-2xl p-6 text-center">
                <Video className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">HD Video Calls</h3>
                <p className="text-gray-600">
                  Enjoy crystal-clear video quality for all your meetings.
                </p>
              </div>

              <div className="rounded-2xl p-6 text-center">
                <MessageCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Real-Time Chat</h3>
                <p className="text-gray-600">
                  Stay connected with instant messaging during calls.
                </p>
              </div>

              <div className="rounded-2xl p-6 text-center">
                <Monitor className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Screen Sharing</h3>
                <p className="text-gray-600">
                  Share your screen seamlessly for presentations and reviews.
                </p>
              </div>

              <div className="rounded-2xl p-6 text-center">
                <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">
                  Secure & Encrypted
                </h3>
                <p className="text-gray-600">
                  Your conversations are safe with end-to-end encryption.
                </p>
              </div>

              <div className="rounded-2xl p-6 text-center">
                <Smartphone className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Cross-Platform</h3>
                <p className="text-gray-600">
                  Works smoothly on desktop, tablet, and mobile devices.
                </p>
              </div>

              <div className="rounded-2xl p-6 text-center">
                <Globe className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">
                  No Downloads Needed
                </h3>
                <p className="text-gray-600">
                  Join meetings instantly from your browser no installs
                  required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer className="py-10">
        <div className="max-w-screen mx-auto">
          <p className="text-center text-sm">
            © {new Date().getFullYear()} Talk2
          </p>
        </div>
      </footer>
    </div>
  );
}
