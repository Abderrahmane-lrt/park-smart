"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { MessageCircle, Send, X, Bot, User, Mic, MicOff, Languages, Sparkles } from "lucide-react"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
  language: string
  quickActions?: QuickAction[]
}

interface QuickAction {
  label: string
  action: string
  icon?: string
}

interface ChatBotProps {
  parkingSpots: any[]
  onBookingRequest?: (spotId: string) => void
  onDirectionsRequest?: (spotId: string) => void
}

const languages = {
  en: "English",
  fr: "Français",
  ar: "العربية",
}

const translations = {
  en: {
    title: "ParkSmart Assistant",
    subtitle: "AI-powered parking guide",
    placeholder: "Ask me about parking in Casablanca...",
    send: "Send",
    listening: "Listening...",
    quickActions: "Quick Actions",
    findParking: "Find Parking",
    checkPrices: "Check Prices",
    getDirections: "Get Directions",
    bookNow: "Book Now",
    viewAvailability: "View Availability",
    nearbyParking: "Nearby Parking",
  },
  fr: {
    title: "Assistant ParkSmart",
    subtitle: "Guide de stationnement IA",
    placeholder: "Demandez-moi des informations sur le stationnement à Casablanca...",
    send: "Envoyer",
    listening: "Écoute...",
    quickActions: "Actions Rapides",
    findParking: "Trouver Parking",
    checkPrices: "Vérifier Prix",
    getDirections: "Itinéraire",
    bookNow: "Réserver",
    viewAvailability: "Voir Disponibilité",
    nearbyParking: "Parking Proche",
  },
  ar: {
    title: "مساعد بارك سمارت",
    subtitle: "دليل مواقف السيارات بالذكاء الاصطناعي",
    placeholder: "اسألني عن مواقف السيارات في الدار البيضاء...",
    send: "إرسال",
    listening: "أستمع...",
    quickActions: "إجراءات سريعة",
    findParking: "البحث عن موقف",
    checkPrices: "فحص الأسعار",
    getDirections: "الاتجاهات",
    bookNow: "احجز الآن",
    viewAvailability: "عرض التوفر",
    nearbyParking: "مواقف قريبة",
  },
}

export default function ChatBot({ parkingSpots, onBookingRequest, onDirectionsRequest }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "fr" | "ar">("en")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  const t = translations[currentLanguage]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message
      const welcomeMessage = getWelcomeMessage()
      setMessages([welcomeMessage])
    }
  }, [isOpen, currentLanguage])

  const getWelcomeMessage = (): Message => {
    const welcomeTexts = {
      en: "👋 Hello! I'm your ParkSmart AI assistant. I can help you find parking spots in Casablanca, check prices, and guide you through booking. What would you like to know?",
      fr: "👋 Bonjour ! Je suis votre assistant IA ParkSmart. Je peux vous aider à trouver des places de parking à Casablanca, vérifier les prix et vous guider dans la réservation. Que souhaitez-vous savoir ?",
      ar: "👋 مرحباً! أنا مساعد بارك سمارت الذكي. يمكنني مساعدتك في العثور على مواقف السيارات في الدار البيضاء، والتحقق من الأسعار، وإرشادك خلال الحجز. ماذا تريد أن تعرف؟",
    }

    return {
      id: Date.now().toString(),
      type: "bot",
      content: welcomeTexts[currentLanguage],
      timestamp: new Date(),
      language: currentLanguage,
      quickActions: [
        { label: t.findParking, action: "find_parking", icon: "🚗" },
        { label: t.checkPrices, action: "check_prices", icon: "💰" },
        { label: t.nearbyParking, action: "nearby_parking", icon: "📍" },
      ],
    }
  }

  const generateBotResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase()
    let response = ""
    let quickActions: QuickAction[] = []

    // Area-specific responses
    if (lowerMessage.includes("maarif") || lowerMessage.includes("معاريف")) {
      const maarifSpots = parkingSpots.filter((spot) => spot.address.toLowerCase().includes("maarif"))
      response = {
        en: `🏢 I found ${maarifSpots.length} parking spots in Maarif district. The Twin Center Parking (30 MAD/hour) and Maarif District Parking (20 MAD/hour) are popular choices. Twin Center offers premium services with valet parking.`,
        fr: `🏢 J'ai trouvé ${maarifSpots.length} places de parking dans le quartier Maarif. Le parking Twin Center (30 MAD/heure) et le parking du quartier Maarif (20 MAD/heure) sont des choix populaires. Twin Center offre des services premium avec voiturier.`,
        ar: `🏢 وجدت ${maarifSpots.length} مواقف سيارات في حي المعاريف. موقف توين سنتر (30 درهم/ساعة) وموقف حي المعاريف (20 درهم/ساعة) خيارات شائعة. يوفر توين سنتر خدمات مميزة مع خدمة الصف.`,
      }[currentLanguage]

      quickActions = [
        { label: "Twin Center", action: "book_twin_center", icon: "🏢" },
        { label: t.getDirections, action: "directions_maarif", icon: "🧭" },
      ]
    } else if (lowerMessage.includes("ain diab") || lowerMessage.includes("عين الذياب")) {
      response = {
        en: `🏖️ Ain Diab has great parking options! Morocco Mall (25 MAD/hour) offers covered parking with 340 available spots. Corniche Parking (18 MAD/hour) is perfect for beach access. Both have excellent ratings!`,
        fr: `🏖️ Ain Diab a d'excellentes options de parking ! Morocco Mall (25 MAD/heure) offre un parking couvert avec 340 places disponibles. Le parking Corniche (18 MAD/heure) est parfait pour l'accès à la plage. Les deux ont d'excellentes notes !`,
        ar: `🏖️ عين الذياب لديها خيارات رائعة لمواقف السيارات! مول المغرب (25 درهم/ساعة) يوفر موقف مغطى مع 340 مكان متاح. موقف الكورنيش (18 درهم/ساعة) مثالي للوصول إلى الشاطئ. كلاهما له تقييمات ممتازة!`,
      }[currentLanguage]

      quickActions = [
        { label: "Morocco Mall", action: "book_morocco_mall", icon: "🛍️" },
        { label: "Corniche", action: "book_corniche", icon: "🏖️" },
      ]
    } else if (
      lowerMessage.includes("cheap") ||
      lowerMessage.includes("budget") ||
      lowerMessage.includes("pas cher") ||
      lowerMessage.includes("رخيص")
    ) {
      const cheapSpots = parkingSpots.filter((spot) => spot.price <= 15).sort((a, b) => a.price - b.price)
      response = {
        en: `💰 Here are the most affordable options: Casa Port Station (12 MAD/hour) - great for train access, Hassan II Mosque (15 MAD/hour) - tourist area with security. Both offer excellent value!`,
        fr: `💰 Voici les options les plus abordables : Gare Casa Port (12 MAD/heure) - excellent pour l'accès au train, Mosquée Hassan II (15 MAD/heure) - zone touristique avec sécurité. Les deux offrent un excellent rapport qualité-prix !`,
        ar: `💰 إليك الخيارات الأكثر اقتصادية: محطة كازا بورت (12 درهم/ساعة) - ممتاز للوصول للقطار، مسجد الحسن الثاني (15 درهم/ساعة) - منطقة سياحية مع أمان. كلاهما يقدم قيمة ممتازة!`,
      }[currentLanguage]

      quickActions = [
        { label: "Casa Port", action: "book_casa_port", icon: "🚂" },
        { label: "Hassan II", action: "book_hassan_mosque", icon: "🕌" },
      ]
    } else if (
      lowerMessage.includes("price") ||
      lowerMessage.includes("cost") ||
      lowerMessage.includes("prix") ||
      lowerMessage.includes("سعر")
    ) {
      response = {
        en: `💳 Parking prices in Casablanca range from 12-30 MAD per hour. Budget: Casa Port (12 MAD), Mid-range: Hassan II Mosque (15 MAD), Corniche (18 MAD), Premium: Morocco Mall (25 MAD), Twin Center (30 MAD). All accept Moroccan cards and international payments.`,
        fr: `💳 Les prix de stationnement à Casablanca vont de 12 à 30 MAD par heure. Budget : Casa Port (12 MAD), Milieu de gamme : Mosquée Hassan II (15 MAD), Corniche (18 MAD), Premium : Morocco Mall (25 MAD), Twin Center (30 MAD). Tous acceptent les cartes marocaines et les paiements internationaux.`,
        ar: `💳 أسعار مواقف السيارات في الدار البيضاء تتراوح من 12-30 درهم في الساعة. اقتصادي: كازا بورت (12 درهم)، متوسط: مسجد الحسن الثاني (15 درهم)، الكورنيش (18 درهم)، مميز: مول المغرب (25 درهم)، توين سنتر (30 درهم). جميعها تقبل البطاقات المغربية والمدفوعات الدولية.`,
      }[currentLanguage]

      quickActions = [
        { label: t.findParking, action: "find_parking", icon: "🔍" },
        { label: t.checkPrices, action: "compare_prices", icon: "📊" },
      ]
    } else if (
      lowerMessage.includes("book") ||
      lowerMessage.includes("reserve") ||
      lowerMessage.includes("réserver") ||
      lowerMessage.includes("حجز")
    ) {
      response = {
        en: `📅 Booking is easy! 1) Select your preferred parking spot 2) Choose date and time 3) Enter your vehicle number (Morocco format) 4) Confirm payment. You'll get a QR code for entry. Arrive within 15 minutes of your booking time.`,
        fr: `📅 La réservation est facile ! 1) Sélectionnez votre place de parking préférée 2) Choisissez la date et l'heure 3) Entrez votre numéro de véhicule (format Maroc) 4) Confirmez le paiement. Vous recevrez un code QR pour l'entrée. Arrivez dans les 15 minutes de votre heure de réservation.`,
        ar: `📅 الحجز سهل! 1) اختر موقف السيارات المفضل لديك 2) اختر التاريخ والوقت 3) أدخل رقم مركبتك (تنسيق المغرب) 4) أكد الدفع. ستحصل على رمز QR للدخول. وصل خلال 15 دقيقة من وقت حجزك.`,
      }[currentLanguage]

      quickActions = [
        { label: t.bookNow, action: "start_booking", icon: "🚗" },
        { label: t.viewAvailability, action: "check_availability", icon: "📊" },
      ]
    } else if (
      lowerMessage.includes("available") ||
      lowerMessage.includes("availability") ||
      lowerMessage.includes("disponible") ||
      lowerMessage.includes("متاح")
    ) {
      const availableSpots = parkingSpots.filter((spot) => spot.available)
      response = {
        en: `✅ Currently ${availableSpots.length} parking spots are available! Morocco Mall has the highest availability (85% predicted), followed by Twin Center (75%). Real-time updates ensure accurate information.`,
        fr: `✅ Actuellement ${availableSpots.length} places de parking sont disponibles ! Morocco Mall a la plus haute disponibilité (85% prédit), suivi de Twin Center (75%). Les mises à jour en temps réel garantissent des informations précises.`,
        ar: `✅ حالياً ${availableSpots.length} مواقف سيارات متاحة! مول المغرب لديه أعلى توفر (85% متوقع)، يليه توين سنتر (75%). التحديثات الفورية تضمن معلومات دقيقة.`,
      }[currentLanguage]

      quickActions = [
        { label: "Morocco Mall", action: "book_morocco_mall", icon: "🛍️" },
        { label: "Twin Center", action: "book_twin_center", icon: "🏢" },
      ]
    } else {
      // Default response
      response = {
        en: `🤖 I can help you with parking in Casablanca! Try asking about specific areas like "Maarif" or "Ain Diab", or ask about prices, availability, or booking steps. What would you like to know?`,
        fr: `🤖 Je peux vous aider avec le stationnement à Casablanca ! Essayez de demander des zones spécifiques comme "Maarif" ou "Ain Diab", ou demandez des prix, la disponibilité ou les étapes de réservation. Que souhaitez-vous savoir ?`,
        ar: `🤖 يمكنني مساعدتك في مواقف السيارات في الدار البيضاء! جرب السؤال عن مناطق محددة مثل "المعاريف" أو "عين الذياب"، أو اسأل عن الأسعار أو التوفر أو خطوات الحجز. ماذا تريد أن تعرف؟`,
      }[currentLanguage]

      quickActions = [
        { label: t.findParking, action: "find_parking", icon: "🔍" },
        { label: t.checkPrices, action: "check_prices", icon: "💰" },
        { label: t.nearbyParking, action: "nearby_parking", icon: "📍" },
      ]
    }

    return {
      id: Date.now().toString(),
      type: "bot",
      content: response,
      timestamp: new Date(),
      language: currentLanguage,
      quickActions,
    }
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
      language: currentLanguage,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(
      () => {
        const botResponse = generateBotResponse(inputValue)
        setMessages((prev) => [...prev, botResponse])
        setIsTyping(false)
      },
      1000 + Math.random() * 1000,
    )
  }

  const handleQuickAction = (action: string) => {
    let message = ""
    switch (action) {
      case "find_parking":
        message = {
          en: "Show me available parking spots",
          fr: "Montrez-moi les places de parking disponibles",
          ar: "أظهر لي مواقف السيارات المتاحة",
        }[currentLanguage]
        break
      case "check_prices":
        message = {
          en: "What are the parking prices?",
          fr: "Quels sont les prix de stationnement ?",
          ar: "ما هي أسعار مواقف السيارات؟",
        }[currentLanguage]
        break
      case "nearby_parking":
        message = {
          en: "Find parking near me",
          fr: "Trouvez un parking près de moi",
          ar: "ابحث عن موقف سيارات بالقرب مني",
        }[currentLanguage]
        break
      default:
        message = action
    }
    setInputValue(message)
    handleSendMessage()
  }

  const handleVoiceInput = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      recognitionRef.current = new SpeechRecognition()

      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = currentLanguage === "ar" ? "ar-MA" : currentLanguage === "fr" ? "fr-FR" : "en-US"

      recognitionRef.current.onstart = () => {
        setIsListening(true)
      }

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInputValue(transcript)
        setIsListening(false)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current.start()
    } else {
      alert("Speech recognition not supported in this browser")
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsListening(false)
  }

  return (
    <>
      {/* Chat Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 z-50 ${
          isOpen ? "scale-0" : "scale-100"
        }`}
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-2rem)] chatbot-container shadow-2xl z-50 bg-white dark:bg-gray-900 backdrop-blur-md border border-gray-200 dark:border-gray-700 flex flex-col">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Bot className="h-8 w-8" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <CardTitle className="text-lg">{t.title}</CardTitle>
                  <p className="text-sm opacity-90">{t.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Select
                  value={currentLanguage}
                  onValueChange={(value: "en" | "fr" | "ar") => setCurrentLanguage(value)}
                >
                  <SelectTrigger className="w-20 h-8 bg-white/20 border-white/30 text-white">
                    <Languages className="h-4 w-4" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">🇺🇸 EN</SelectItem>
                    <SelectItem value="fr">🇫🇷 FR</SelectItem>
                    <SelectItem value="ar">🇲🇦 AR</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex flex-col flex-1 min-h-0 p-0">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4 min-h-0 chatbot-messages" style={{ maxHeight: 350, overflowY: "auto" }}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.type === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                      } ${currentLanguage === "ar" ? "text-right" : "text-left"}`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.type === "bot" && (
                          <Sparkles className="h-4 w-4 mt-1 text-purple-500 dark:text-purple-400" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                        {message.type === "user" && <User className="h-4 w-4 mt-1" />}
                      </div>

                      {/* Quick Actions */}
                      {message.quickActions && message.quickActions.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.quickActions.map((action, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuickAction(action.action)}
                              className="text-xs bg-white/20 border-white/30 hover:bg-white/30 text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
                            >
                              {action.icon && <span className="mr-1">{action.icon}</span>}
                              {action.label}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 max-w-[80%]">
                      <div className="flex items-center space-x-2">
                        <Bot className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex-shrink-0 chatbot-input">
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={t.placeholder}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className={`pr-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border-gray-300 dark:border-gray-600 ${currentLanguage === "ar" ? "text-right" : "text-left"}`}
                    dir={currentLanguage === "ar" ? "rtl" : "ltr"}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={isListening ? stopListening : handleVoiceInput}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${
                      isListening ? "text-red-500 animate-pulse" : "text-gray-400 dark:text-gray-500"
                    }`}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {isListening && (
                <div className="mt-2 text-center">
                  <Badge
                    variant="outline"
                    className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700"
                  >
                    <Mic className="h-3 w-3 mr-1" />
                    {t.listening}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
