"use client";
import { useRouter } from "next/navigation";
import { CheckCircle2, Mail, MessageSquare, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";

const FarmerRegistrationSuccessPage = () => {
  const router = useRouter();

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat px-4 py-8 relative overflow-hidden"
      style={{
        backgroundImage: "url('https://gttp.images.tshiftcdn.com/225661/x/0/top-18-banaue-tourist-spots-rice-terraces-and-nature-trips-3.jpg?auto=compress%2Cformat&ch=Width%2CDPR&dpr=1&ixlib=php-3.3.0&w=883')", // 👈 change this path to your image
      }}
    >
      {/* Overlay for better text contrast */}
      <div className="absolute inset-0 bg-black0 backdrop-blur-[1px]"></div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes checkmark {
          0% {
            transform: scale(0) rotate(-45deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.1) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-scale {
          animation: scaleIn 0.6s ease-out forwards;
        }

        .animate-check {
          animation: checkmark 0.6s ease-out 0.3s forwards;
        }

        .animate-pulse-glow {
          animation: pulse 2s ease-in-out infinite;
        }

        .animate-slide-left {
          animation: slideInLeft 0.6s ease-out forwards;
        }

        .delay-100 {
          animation-delay: 0.1s;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }

        .delay-300 {
          animation-delay: 0.3s;
        }

        .delay-400 {
          animation-delay: 0.4s;
        }

        .delay-500 {
          animation-delay: 0.5s;
        }

        .delay-600 {
          animation-delay: 0.6s;
        }

        .delay-700 {
          animation-delay: 0.7s;
        }

        .initial-hidden {
          opacity: 0;
        }
      `}</style>

      {/* Main Content */}
      <div className="w-full max-w-2xl relative z-10">
        {/* Success Icon and Image Section */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6 animate-scale">
            <div className="absolute inset-0 bg-[#009765] opacity-10 rounded-full blur-2xl scale-150 animate-pulse-glow"></div>
            <div className="relative bg-gradient-to-br from-[#009765] to-[#007850] p-6 rounded-full inline-block shadow-lg">
              <CheckCircle2 className="text-white animate-check" size={72} strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Main Card */}
        <Card className="shadow-xl border-2 border-[#009765]/20 rounded-3xl overflow-hidden animate-fade-up delay-400 initial-hidden bg-white/90 backdrop-blur-md">
          <div className="bg-gradient-to-r from-[#009765] to-[#007850] h-2"></div>

          <CardHeader className="pb-4 pt-8">
            <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-[#009765] to-[#007850] bg-clip-text text-transparent">
              Registration Successful!
            </CardTitle>
            <p className="text-center text-gray-600 mt-2 text-sm font-medium">
              Welcome to the farming community
            </p>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            {/* Status Info */}
            <div className="bg-[#009765]/5 rounded-2xl p-6 mb-6 border border-[#009765]/10 animate-slide-left delay-500 initial-hidden">
              <div className="flex items-start gap-3 mb-4">
                <Clock className="text-[#009765] mt-1 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    Pending Approval
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Your registration has been submitted successfully. Our admin team will review your application shortly.
                  </p>
                </div>
              </div>
            </div>

            {/* Notification Info */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-sm text-gray-600 animate-slide-left delay-600 initial-hidden">
                <div className="bg-[#009765]/10 p-2 rounded-lg">
                  <Mail className="text-[#009765]" size={20} />
                </div>
                <span>You'll receive an email notification upon approval</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 animate-slide-left delay-700 initial-hidden">
                <div className="bg-[#009765]/10 p-2 rounded-lg">
                  <MessageSquare className="text-[#009765]" size={20} />
                </div>
                <span>SMS updates will be sent to your registered number</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 animate-fade-up delay-700 initial-hidden">
              <Button
                variant="outline"
                onClick={() => router.push("/organic-registrations/info")}
                className="flex-1 h-12 border-2 border-[#009765] text-[#009765] hover:bg-[#009765]/5 font-semibold rounded-xl transition-all hover:scale-105"
              >
                Review Registration
              </Button>
              <Button
                onClick={() => router.push("/sign-in")}
                className="flex-1 h-12 bg-gradient-to-r from-[#009765] to-[#007850] hover:from-[#007850] hover:to-[#009765] text-white font-semibold rounded-xl shadow-lg shadow-[#009765]/30 transition-all hover:scale-105"
              >
                Go to Login
              </Button>
            </div>

            {/* Additional Help Text */}
            <p className="text-center text-xs text-gray-400 mt-6">
              Questions? Contact our support team for assistance
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FarmerRegistrationSuccessPage;
